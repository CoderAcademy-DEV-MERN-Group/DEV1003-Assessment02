import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import Friendship from '../../models/Friendship';
import User from '../../models/User';
import { clearTestDb, setupTestDb, teardownTestDb } from '../setup/testDb';
import { userFixture } from '../setup/fixtures';

// Setup, clear and teardown in memory test MongoDB database
beforeAll(async () => {
  await setupTestDb();
});

afterAll(async () => {
  await teardownTestDb();
});

beforeEach(async () => {
  await clearTestDb();
});

describe('Friendship Model - Schema Validation', () => {
  let user1;
  let user2;

  beforeEach(async () => {
    // Create test users
    user1 = await User.create(userFixture({ username: 'user1', email: 'user1@test.com' }));
    user2 = await User.create(userFixture({ username: 'user2', email: 'user2@test.com' }));
  });

  test('should create a friendship with valid data', async () => {
    const friendship = await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
      friendRequestAccepted: false,
    });

    // Check that both users are in the friendship (order may vary due to normalization)
    const userIds = [friendship.user1.toString(), friendship.user2.toString()];
    expect(userIds).toContain(user1.id);
    expect(userIds).toContain(user2.id);
    expect(friendship.requesterUserId.toString()).toEqual(user1.id);
    expect(friendship.friendRequestAccepted).toBe(false);
    expect(friendship.createdAt).toBeDefined();
    expect(friendship.updatedAt).toBeDefined();
  });

  test('should default friendRequestAccepted to false when not provided', async () => {
    const friendship = await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
      // friendRequestAccepted not provided - should default to false
    });

    expect(friendship.friendRequestAccepted).toBe(false);
  });

  test('should reject friendship without required fields', async () => {
    await expect(
      Friendship.create({
        user1: user1.id,
        // Missing user2
        requesterUserId: user1.id,
      }),
    ).rejects.toThrow();

    await expect(
      Friendship.create({
        // Missing user1
        user2: user2.id,
        requesterUserId: user1.id,
      }),
    ).rejects.toThrow();

    await expect(
      Friendship.create({
        user1: user1.id,
        user2: user2.id,
        // Missing requesterUserId
      }),
    ).rejects.toThrow();
  });
});

describe('Friendship Model - Self-Friendship Validation', () => {
  let user1;

  beforeEach(async () => {
    user1 = await User.create(userFixture({ username: 'user1', email: 'user1@test.com' }));
  });

  test('should reject friendship with same user (user1 === user2)', async () => {
    await expect(
      Friendship.create({
        user1: user1.id,
        user2: user1.id,
        requesterUserId: user1.id,
      }),
    ).rejects.toThrow(/Cannot create friendship with yourself/);
  });
});

describe('Friendship Model - Automatic Ordering (Normalization)', () => {
  let user1;
  let user2;

  beforeEach(async () => {
    user1 = await User.create(userFixture({ username: 'user1', email: 'user1@test.com' }));
    user2 = await User.create(userFixture({ username: 'user2', email: 'user2@test.com' }));
  });

  test('should automatically order user IDs (smaller first)', async () => {
    // Create with IDs in any order
    const friendship = await Friendship.create({
      user1: user2.id, // larger ID first
      user2: user1.id, // smaller ID second
      requesterUserId: user2.id,
    });

    // Should be reordered to user1 < user2
    const user1Str = friendship.user1.toString();
    const user2Str = friendship.user2.toString();
    expect(user1Str < user2Str).toBe(true);
  });
});

describe('Friendship Model - Unique Index (No Duplicates)', () => {
  let user1;
  let user2;

  beforeEach(async () => {
    user1 = await User.create(userFixture({ username: 'user1', email: 'user1@test.com' }));
    user2 = await User.create(userFixture({ username: 'user2', email: 'user2@test.com' }));
  });

  test('should reject duplicate friendship (same order)', async () => {
    await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
    });

    // Try to create duplicate
    await expect(
      Friendship.create({
        user1: user1.id,
        user2: user2.id,
        requesterUserId: user2.id,
      }),
    ).rejects.toThrow();
  });

  test('should reject duplicate friendship (reversed order)', async () => {
    await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
    });

    // Try to create reverse duplicate (should be normalized to same order)
    await expect(
      Friendship.create({
        user1: user2.id, // reversed
        user2: user1.id, // reversed
        requesterUserId: user2.id,
      }),
    ).rejects.toThrow();
  });
});

describe('Friendship Model - Static Method: findBetween()', () => {
  let user1;
  let user2;
  let user3;

  beforeEach(async () => {
    user1 = await User.create(userFixture({ username: 'user1', email: 'user1@test.com' }));
    user2 = await User.create(userFixture({ username: 'user2', email: 'user2@test.com' }));
    user3 = await User.create(userFixture({ username: 'user3', email: 'user3@test.com' }));
  });

  test('should find friendship between two users', async () => {
    const created = await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
    });

    const found = await Friendship.findBetween(user1.id, user2.id);

    expect(found).toBeDefined();
    expect(found.id.toString()).toBe(created.id.toString());
  });

  test('should find friendship regardless of parameter order', async () => {
    await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
    });

    const found1 = await Friendship.findBetween(user1.id, user2.id);
    const found2 = await Friendship.findBetween(user2.id, user1.id);

    expect(found1).toBeDefined();
    expect(found2).toBeDefined();
    expect(found1.id).toBe(found2.id);
  });

  test('should return null if friendship does not exist', async () => {
    const found = await Friendship.findBetween(user1.id, user3.id);
    expect(found).toBeNull();
  });
});

describe('Friendship Model - Static Method: areFriends()', () => {
  let user1;
  let user2;
  let user3;

  beforeEach(async () => {
    user1 = await User.create(userFixture({ username: 'user1', email: 'user1@test.com' }));
    user2 = await User.create(userFixture({ username: 'user2', email: 'user2@test.com' }));
    user3 = await User.create(userFixture({ username: 'user3', email: 'user3@test.com' }));
  });

  test('should return false if no friendship exists', async () => {
    const result = await Friendship.areFriends(user1.id, user2.id);
    expect(result).toBe(false);
  });

  test('should return false if friendship is pending (not accepted)', async () => {
    await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
      friendRequestAccepted: false,
    });

    const result = await Friendship.areFriends(user1.id, user2.id);
    expect(result).toBe(false);
  });

  test('should return true if friendship is accepted', async () => {
    await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
      friendRequestAccepted: true,
    });

    const result = await Friendship.areFriends(user1.id, user2.id);
    expect(result).toBe(true);
  });

  test('should return true regardless of parameter order', async () => {
    await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
      friendRequestAccepted: true,
    });

    const result1 = await Friendship.areFriends(user1.id, user2.id);
    const result2 = await Friendship.areFriends(user2.id, user1.id);

    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  test('should return false for users who are not friends', async () => {
    await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
      friendRequestAccepted: true,
    });

    // user3 is not friends with anyone
    const result = await Friendship.areFriends(user1.id, user3.id);
    expect(result).toBe(false);
  });
});

describe('Friendship Model - Integration: Accept Friendship Flow', () => {
  let user1;
  let user2;

  beforeEach(async () => {
    user1 = await User.create(userFixture({ username: 'user1', email: 'user1@test.com' }));
    user2 = await User.create(userFixture({ username: 'user2', email: 'user2@test.com' }));
  });

  test('should simulate full friendship request and acceptance flow', async () => {
    // 1. User1 sends friend request to User2
    const friendship = await Friendship.create({
      user1: user1.id,
      user2: user2.id,
      requesterUserId: user1.id,
    });
    expect(friendship.friendRequestAccepted).toBe(false);

    // 2. Check they are not friends yet
    let areFriends = await Friendship.areFriends(user1.id, user2.id);
    expect(areFriends).toBe(false);

    // 3. User2 accepts the request
    friendship.friendRequestAccepted = true;
    await friendship.save();

    // 4. Check they are now friends
    areFriends = await Friendship.areFriends(user1.id, user2.id);
    expect(areFriends).toBe(true);

    // 5. Verify friendship can be found from either direction
    const found1 = await Friendship.findBetween(user1.id, user2.id);
    const found2 = await Friendship.findBetween(user2.id, user1.id);
    expect(found1.id.toString()).toBe(found2.id.toString());
  });
});
