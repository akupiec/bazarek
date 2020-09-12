export const createTable = `
    create table if not exists bazarek
    (
        id         INTEGER not null
            constraint bazarek_pk
                primary key,
        href       TEXT,
        name       TEXT    not null,
        price      INTEGER,
        offers     INTEGER not null,
        updateTime TEXT,
        steamHref  TEXT
    );

    create unique index bazarek_id_uindex
        on bazarek (id);

`;

export const clearOldData = `
UPDATE bazarek SET offers = 0, price = 0 WHERE  id IN (select id from bazarek where datetime(updateTime) < datetime('now', '-6 hours'));
`;

export const selectSteamToUpdate = `
SELECT * FROM bazarek Where steamHref is null;
`;
