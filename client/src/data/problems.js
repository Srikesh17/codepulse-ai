export const SAMPLE_PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topic: 'Hashing',
    acceptance: '51.4%',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      }
    ],
    starterCode: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        # Your Socratic thinking:
        # What lookup structure gives O(1) checks for complements?
        pass
`,
    socraticHints: [
      {
        level: 1,
        title: 'Level 1: Intuition Nudge',
        content: 'A brute force checks every pair in O(N^2). If you are looking at number x, what exact value are you hoping to find?'
      },
      {
        level: 2,
        title: 'Level 2: Data Structure Strategy',
        content: 'As you iterate forward, you can store numbers you have already visited in a hash map mapping value -> index. What is the complement?'
      },
      {
        level: 3,
        title: 'Level 3: Algorithmic Invariant',
        content: 'For each index i, check if (target - nums[i]) is already in seen. If yes, return [seen[target - nums[i]], i]. Otherwise insert seen[nums[i]] = i.'
      }
    ]
  },
  {
    id: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    topic: 'Strings',
    acceptance: '64.1%',
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    starterCode: `class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'What invariant must hold between the lengths and character counts of both strings?' },
      { level: 2, title: 'Level 2: Frequency Mapping', content: 'Could you count frequencies of each character in s, and decrement them for each character in t?' },
      { level: 3, title: 'Level 3: Optimization', content: 'Using a fixed-size array of 26 integers or a Python collections.Counter yields O(N) time and O(1) auxiliary space.' }
    ]
  },
  {
    id: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    topic: 'Arrays',
    acceptance: '53.9%',
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`i\`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and the max profit = 0.' }
    ],
    starterCode: `class Solution:
    def maxProfit(self, prices: list[int]) -> int:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'If you sell on day i, when must you have bought?' },
      { level: 2, title: 'Level 2: Running Minimum', content: 'As you scan from left to right, keep track of the minimum purchase price seen so far.' },
      { level: 3, title: 'Level 3: Constant Space Loop', content: 'Update min_price = min(min_price, price) and max_profit = max(max_profit, price - min_price).' }
    ]
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    topic: 'Two Pointers',
    acceptance: '47.2%',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false' }
    ],
    starterCode: `class Solution:
    def isPalindrome(self, s: str) -> bool:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'Can we check symmetry from the outside moving inward without copying strings?' },
      { level: 2, title: 'Level 2: Two Pointers', content: 'Place one pointer at index 0 and one at len(s)-1. Skip non-alphanumeric characters with .isalnum().' },
      { level: 3, title: 'Level 3: Convergence', content: 'Compare characters lowercase. If they mismatch, return False. Advance inward until pointers meet.' }
    ]
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    acceptance: '55.3%',
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`i\`th line are \`(i, 0)\` and \`(i, height[i])\`.\n\nFind two lines that together with the x-axis form a container, such that the container contains the most water.\n\nReturn the maximum amount of water a container can store.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max area is between index 1 and 8: min(8, 7) * (8 - 1) = 49.' }
    ],
    starterCode: `class Solution:
    def maxArea(self, height: list[int]) -> int:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'Area is width * min(height[left], height[right]). What happens to width as pointers converge?' },
      { level: 2, title: 'Level 2: Greedy Choice', content: 'To compensate for diminishing width, we need greater height. Which of the two boundaries is limiting our current water height?' },
      { level: 3, title: 'Level 3: Invariant Step', content: 'Always move the pointer pointing to the shorter vertical bar inward, because moving the taller one can never increase area.' }
    ]
  },
  {
    id: 'three-sum',
    title: '3Sum',
    difficulty: 'Medium',
    topic: 'Two Pointers',
    acceptance: '34.8%',
    description: `Given an integer array nums, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.\n\nNotice that the solution set must not contain duplicate triplets.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' }
    ],
    starterCode: `class Solution:
    def threeSum(self, nums: list[int]) -> list[list[int]]:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'Can we reduce 3Sum to multiple 2Sum subproblems? What pre-processing step helps avoid duplicates?' },
      { level: 2, title: 'Level 2: Sorting', content: 'Sort the array first in O(N log N). Then fix one element nums[i] and use two pointers for the remaining sub-array.' },
      { level: 3, title: 'Level 3: Duplicate Skipping', content: 'Skip duplicate values when iterating i, and also increment/decrement left/right after finding a valid triplet.' }
    ]
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    topic: 'Hashing',
    acceptance: '68.5%',
    description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    starterCode: `class Solution:
    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'What canonical key representation is identical for all words that are anagrams of each other?' },
      { level: 2, title: 'Level 2: Key Canonicalization', content: 'Either a sorted string tuple (e.g. tuple(sorted(word))) or a tuple of 26 count frequencies can serve as the hash dictionary key.' },
      { level: 3, title: 'Level 3: Grouping Loop', content: 'Use collections.defaultdict(list) to append each word to dict[key], then return list(dict.values()).' }
    ]
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    topic: 'Dynamic Programming',
    acceptance: '53.1%',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1 step + 1 step, or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' }
    ],
    starterCode: `class Solution:
    def climbStairs(self, n: int) -> int:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'To reach step n, you could have come from step (n-1) or step (n-2). What recurrence relation does this suggest?' },
      { level: 2, title: 'Level 2: Overlapping Subproblems', content: 'ways(n) = ways(n-1) + ways(n-2). This mirrors the classic Fibonacci sequence.' },
      { level: 3, title: 'Level 3: Space Optimization', content: 'Instead of an entire DP table, maintain two variables a and b in O(1) space.' }
    ]
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    topic: 'Dynamic Programming',
    acceptance: '44.2%',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' }
    ],
    starterCode: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'Why does a greedy approach (always taking the biggest coin) fail for general denominations like [1, 3, 4] with amount 6?' },
      { level: 2, title: 'Level 2: Subproblem State', content: 'Let dp[a] be the minimum coins to make amount a. For each coin c, dp[a] = min(dp[a], dp[a - c] + 1).' },
      { level: 3, title: 'Level 3: Base Conditions', content: 'Initialize dp table of size amount + 1 with infinity (amount + 1), set dp[0] = 0. Iterate bottom up.' }
    ]
  },
  {
    id: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    topic: 'Hashing',
    acceptance: '47.5%',
    description: `Given an unsorted array of integers \`nums\`, return the length of the longest consecutive elements sequence.\n\nYou must write an algorithm that runs in \`O(n)\` time.`,
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.' }
    ],
    starterCode: `class Solution:
    def longestConsecutive(self, nums: list[int]) -> int:
        pass
`,
    socraticHints: [
      { level: 1, title: 'Level 1: Intuition Nudge', content: 'Sorting takes O(N log N). How can a set allow us to identify the beginning of a sequence in O(1)?' },
      { level: 2, title: 'Level 2: Sequence Starts', content: 'A number num is the start of a consecutive sequence if and only if (num - 1) is NOT in our set.' },
      { level: 3, title: 'Level 3: Linear Traversal', content: 'Only expand when num - 1 is absent. Count streak while (num + current_streak) is in the set. Each element is checked at most twice.' }
    ]
  }
];
