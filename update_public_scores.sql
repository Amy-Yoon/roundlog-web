-- Give Kim Pro's SKY72 round (71) some hole scores
-- Round ID: 10000000-0000-0000-0000-000000000001
-- Total Par: 72, Score: 71 (-1)
-- One birdie at hole 3 (Par 3 -> 2)

UPDATE rounds 
SET hole_scores = '{
  "1": 4, "2": 4, "3": 2, "4": 4, "5": 5, "6": 4, "7": 5, "8": 3, "9": 4,
  "10": 4, "11": 4, "12": 3, "13": 5, "14": 4, "15": 4, "16": 4, "17": 3, "18": 5
}'::jsonb
WHERE id = '10000000-0000-0000-0000-000000000001';

-- Give Newbie Lee's SKY72 round (108) scores
-- Round ID: 10000000-0000-0000-0000-000000000003
-- Just some high scores
UPDATE rounds
SET hole_scores = '{
  "1": 6, "2": 7, "3": 4, "4": 6, "5": 8, "6": 6, "7": 7, "8": 5, "9": 6,
  "10": 6, "11": 6, "12": 5, "13": 8, "14": 6, "15": 5, "16": 6, "17": 5, "18": 6
}'::jsonb
WHERE id = '10000000-0000-0000-0000-000000000003';
