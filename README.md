# Assignment 2


## Scoring

| **Item**                  | **Score** | **Check** |
| :---------------------    | :-------: | :-------: |
| Complete Game Process     |    5%     |     Y     |
| World Map                 |    10%    |     Y     |
| Level Design              |    5%     |     Y     |
| Player                    |    15%    |     Y     |
| Enemies                   |    15%    |     Y     |
| Question Blocks           |    5%     |     Y     |
| Animations                |    10%    |     N     |
| Sound Effects             |    10%    |     Y     |
| UI                        |    10%    |     Y     |
| Bonus                     |    10%    |     Y     |
| Git                       |    5%     |     Y     |

**Enemies Animations:** Goomba walk and goomba dead\
**Bonus:** Firebase, Leaderboard


## How to Play
Press A/D to move left and right, SPACE to jump

Press T will power down if the player is powered up, avoiding stucking in blocks

Player has 3 lives per game

Top 5 players with the highest score in the level will be displayed on leaderboard


## Custom Level
Upload a .txt file can dynamically generate a level

### File Format
- First line is an integer indicating game time in seconds
- For the following lines, each line maps to a horizontal row in game, each char maps to a prefab
```
F: floor
W: wall
-: wood platform
S: pipe
Q: question block
B: block
P: win flag
1: goomba
other: nothing
```

### For example: level1.txt
```
100
______________________________S_____________________________W
______________________________W_____________________________W
______________________________W_____________________________W
______________________BQQQQB__W_____________________________W
______________________________W_____________________________W
______________________________W_____________________________W
__W___________________BQQQQB__W_____________________________W
__W_____________W____________WW_____________________________W
Q_W_________W_____W_________WWW_____________________________W
________W_________-------------_____________________________W
1_1W_____________________________Q__________________________W
WWWWW_______________________________________________________W
____________________________________________________________W
___________________________________---_____1________________W
____B_____________________________________BQB_______________W
__________1__________1W_____________________________________W
________QQQQ_________WWW____________________________________W
___________________1WWWWW________________BQBQB______________W
_____--____________WWWWWWW__________________________________W
_________1____S__1WWWWWWWWW__1___S____W_________1____S__P___W
FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF____FFFFFFFFFFFFFFFFFFFFFFF
```


## Web page link
https://web-mario-6423f.web.app/


