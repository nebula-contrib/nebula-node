# Nebula

## Prepare data

1. create space

```shell
create space nebula_node(vid_type = fixed_string(30));
```

2. create tag

```shell
create tag company(name string);
create tag person(name string, age int);
```

3. create edge

```shell
create edge invest(percent float);
create edge employee(years int);
```

4. create vertex data

```shell
insert vertex company(name) values "c001":("company - 1");
insert vertex person(name,age) values "p001":("person - 1", 30);
insert vertex person(name,age) values "p002":("person - 2", 20);
```

5. create edge data

```shell
insert edge invest(percent) values "p001"->"c001":(0.8);
insert edge employee(years) values "c001"->"p002":(2);
```

## Query

1. get subgraph

```shell
get subgraph with prop 2 steps from "p001" yield vertices as nodes, edges as relationships;
```

2. fetch vertex or edge properties

```shell
fetch prop on company "c001" yield properties(vertex);
fetch prop on company "c001" yield properties(vertex).name as name;
fetch prop on invest "p001"->"c001" yield properties(edge);
```

3. go from

```shell
go from "c001" over employee yield properties($^), properties($$), properties(edge);
```

4. find path

```shell
find noloop path with prop from "p001" to "p002" over invest, employee bidirect upto 2 steps yield path as p;
find noloop path with prop from "p001" to "p002" over * yield path as p;
```
