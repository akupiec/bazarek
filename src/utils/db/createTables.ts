export const createBazarek = `
    create table if not exists bazarek
    (
        id     INTEGER not null
            constraint bazarek_pk
                primary key,
        href   TEXT,
        name   TEXT    not null,
        price  INTEGER,
        offers INTEGER not null,
        updateTime TEXT not null
    );

    create unique index bazarek_id_uindex
        on bazarek (id);

    create unique index bazarek_name_uindex
        on bazarek (name);

`;
