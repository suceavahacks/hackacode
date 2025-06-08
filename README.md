# hackacode

> is this a leetcode clone?!

## what's this?

hackacode is a vibey competitive programming platform where you can solve coding challenges, duel with friends, and enjoy coding in a chill environment. the platform combines next.js, typescript, and supabase on the frontend with a high-performance go-based code judge on the backend.

## features

- algorithmic challenges - solve exciting coding problems with instant feedback
- live duels - challenge your friends to 1v1 coding battles
- daily streaks - keep your coding streak alive with daily challenges
- leaderboard - see where you stand among other coders
- luigi ai - get help from our ai assistant for code review and tips
- cli integration - submit your solutions directly from your terminal
- live feed - watch submissions happen in real-time

## getting started

1. create an account at [hackacode.xyz](https://hackacode.xyz)
2. browse available challenges
3. start coding and submit your solutions
4. check the [docs](https://hackacode.xyz/docs) for detailed information

## cli usage

```bash
# install the cli
curl https://hackacode.xyz/download | bash

# set your api key (from settings page)
export HACKACODE_API_KEY="your-api-key"

# submit a solution to a challenge
hackacode submit --file solution.py --challenge two-sum --language Python

# run a solution with custom input
hackacode run --file solution.py --language Python --input input.txt
```

## tech stack

- frontend: next.js, typescript, tailwind css, daisy ui
- backend: supabase, go
- code judge: custom go judging system with sandboxed environment, isolate, also used in IOI

## contributing

we're open to contributions! feel free to submit prs, report bugs, or suggest features. check out our [contributing guidelines](https://hackacode.xyz/docs) for more info.

## license

hackacode is open-source software licensed under the mit license.

## credits

built during neighborhood by Adelin!!