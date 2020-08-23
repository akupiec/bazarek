CLI tool helpful in searching interesting games in https://bazar.lowcygier.pl/

#### To build & Use:
 ```sh
  yarn install
  yarn build
  dist/bazarek.sh --help
```

#### To use directly without building:
```npx ts-node src/index.ts --help```
(works as well in debuge mode directly inside IDE)
 

#### Notes:
Currently, there is no configuration for filters and printing output. 
To make some changes edit code directly inside: [filtering file](src/commands/list-interesting-games.ts)

to skip some games in final result add them inside: [ignored-games](data/ignored-games.ts)
