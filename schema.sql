DROP TABLE IF EXISTS sim;

CREATE TABLE sim (
    id serial not null primary key,
    image1 text,
    character1 text,
    quote text,
    characterDirection text
);

-- INSERT INTO sim (image1, character1, quote,characterDirection) VALUES ($1,$2,$3,$4);

-- SELECT * FROM sim;
-- UPDATE sim SET image1 = $1, character1 = $2,  quote = $3, characterDirection = $4 WHERE id=$5;