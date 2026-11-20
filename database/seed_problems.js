/**
 * CodePulse AI — Problem Seed Script (Phase 3)
 * Idempotent: uses INSERT ... ON CONFLICT (slug) DO NOTHING
 * Run: node database/seed_problems.js
 */

import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../server/.env') });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL?.includes('supabase')
    ? { rejectUnauthorized: false }
    : false,
});

const PROBLEMS = [
  {
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    topics: ['Arrays', 'Hashing'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers that add up to \`target\`.

You may assume that each input has exactly one solution, and you may not use the same element twice. Return the answer in any order.`,
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9, so return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    function_name: 'twoSum',
    starter_code: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Hint: What lookup structure gives O(1) complement checks?
        pass
`,
  },
  {
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    topics: ['Stack', 'Strings'],
    description: `Given a string \`s\` containing only the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\`, and \`]\`, determine if the input string is valid.

A string is valid if:
- Every open bracket is closed by the same type of bracket.
- Open brackets must be closed in the correct order.
- Every close bracket has a corresponding open bracket.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \\'()[]{}\\''],
    function_name: 'isValid',
    starter_code: `class Solution:
    def isValid(self, s: str) -> bool:
        # Hint: Which data structure preserves insertion order and supports last-in-first-out?
        pass
`,
  },
  {
    slug: 'best-time-to-buy-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    topics: ['Arrays', 'Two Pointers'],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on day \`i\`.

You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.

Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return \`0\`.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1) and sell on day 5 (price=6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No transaction achieves a positive profit.' },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    function_name: 'maxProfit',
    starter_code: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        # Hint: Track the minimum price seen so far as you scan left to right.
        pass
`,
  },
  {
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'easy',
    topics: ['Arrays', 'Hashing'],
    description: `Given an integer array \`nums\`, return \`true\` if any value appears at least twice in the array, and return \`false\` if every element is distinct.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' },
      { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    function_name: 'containsDuplicate',
    starter_code: `class Solution:
    def containsDuplicate(self, nums: list[int]) -> bool:
        # Hint: Can you use a set to track previously seen values?
        pass
`,
  },
  {
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'easy',
    topics: ['Strings', 'Hashing'],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An anagram is a word formed by rearranging the letters of a different word using all the original letters exactly once.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters'],
    function_name: 'isAnagram',
    starter_code: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        # Hint: What if you counted the frequency of each character in both strings?
        pass
`,
  },
  {
    slug: 'longest-substring-without-repeating',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    topics: ['Strings', 'Sliding Window', 'Hashing'],
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols, and spaces'],
    function_name: 'lengthOfLongestSubstring',
    starter_code: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        # Hint: Use a sliding window. When does the window need to shrink?
        pass
`,
  },
  {
    slug: 'three-sum',
    title: 'Three Sum',
    difficulty: 'medium',
    topics: ['Arrays', 'Two Pointers'],
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

The solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    function_name: 'threeSum',
    starter_code: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        # Hint: Sort first. Then fix one element and reduce to a two-pointer two-sum.
        pass
`,
  },
  {
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    topics: ['Binary Search', 'Arrays'],
    description: `Given an array of integers \`nums\` sorted in ascending order and an integer \`target\`, write a function to search for \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' },
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All the integers in nums are unique.', 'nums is sorted in ascending order.'],
    function_name: 'search',
    starter_code: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        # Hint: Maintain left and right pointers. How do you halve the search space?
        pass
`,
  },
  {
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    topics: ['Dynamic Programming', 'Recursion'],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step  2. 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1. 1+1+1  2. 1+2  3. 2+1' },
    ],
    constraints: ['1 <= n <= 45'],
    function_name: 'climbStairs',
    starter_code: `class Solution:
    def climbStairs(self, n: int) -> int:
        # Hint: How many ways are there to reach step n from step n-1 and n-2?
        pass
`,
  },
  {
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    topics: ['Arrays', 'Dynamic Programming'],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum and return its sum.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    function_name: 'maxSubArray',
    starter_code: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        # Hint: At each index, should you extend the current subarray or start fresh?
        pass
`,
  },
  {
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'medium',
    topics: ['Arrays', 'Sorting'],
    description: `Given an array of \`intervals\` where \`intervals[i] = [start_i, end_i]\`, merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap, so merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    function_name: 'merge',
    starter_code: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        # Hint: Sort by start time first. When does the last merged interval extend?
        pass
`,
  },
  {
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'easy',
    topics: ['Trees', 'Recursion'],
    description: `Given the \`root\` of a binary tree, invert the tree (swap left and right children at every node) and return its root.`,
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]' },
      { input: 'root = [2,1,3]', output: '[2,3,1]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    function_name: 'invertTree',
    starter_code: `# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, val=0, left=None, right=None):
#         self.val = val
#         self.left = left
#         self.right = right

class Solution:
    def invertTree(self, root):
        # Hint: What is the base case? Then swap, and recurse left and right.
        pass
`,
  },
  {
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'medium',
    topics: ['Dynamic Programming'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    examples: [
      { input: 'coins = [1,5,11], amount = 15', output: '3', explanation: '5 + 5 + 5 = 15' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' },
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    function_name: 'coinChange',
    starter_code: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        # Hint: Build a dp array where dp[i] = minimum coins to make amount i.
        pass
`,
  },
];

async function seed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Seeding problems...');

    let inserted = 0;
    let skipped = 0;

    for (const p of PROBLEMS) {
      const result = await client.query(
        `INSERT INTO problems
          (slug, title, description, difficulty, topics, constraints, examples, starter_code, function_name, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
         ON CONFLICT (slug) DO NOTHING
         RETURNING id`,
        [
          p.slug,
          p.title,
          p.description,
          p.difficulty,
          p.topics,
          JSON.stringify(p.constraints),
          JSON.stringify(p.examples),
          p.starter_code,
          p.function_name,
          true,
        ]
      );

      if (result.rowCount > 0) {
        console.log(`  ✅ Inserted: ${p.title}`);
        inserted++;
      } else {
        console.log(`  ⏭️  Skipped (already exists): ${p.title}`);
        skipped++;
      }
    }

    console.log(`\n✅ Seeding complete: ${inserted} inserted, ${skipped} skipped.`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
