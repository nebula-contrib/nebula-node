/* eslint-disable max-len */
/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import createClient, { type ClientOption } from '../src';
import { describe, expect, test } from '@jest/globals';

const nebulaServer: ClientOption = {
  servers: ['127.0.0.1:9669'],
  userName: 'root',
  password: 'nebula',
  space: 'nebula_node',
  pingInterval: 5000,
  poolSize: 1
}

const commands = {
  cmd1: 'get subgraph with prop 2 steps from "p001" yield vertices as nodes, edges as relationships',
  cmd2: 'fetch prop on company "c001" yield properties(vertex) as node',
  cmd3: 'go from "c001" over employee yield properties($^) as a, properties($$) as b, properties(edge) as p',
  cmd4: 'find noloop path with prop from "p001" to "p002" over * yield path as p',
  cmd5: 'RETURN list[1, 2, 3] AS a',
  cmd6: 'UNWIND list[list[1, 2, 3], list[2, 3, 4]] as a RETURN a',
  cmd7: 'RETURN set{1, 2, 3} AS a',
  cmd8: 'RETURN map{a: LIST[1,2], b: SET{1,2,1}, c: "hee"} as a'
}

describe('nebula', () => {
  test('test-case-1', async () => {
    const client = createClient(nebulaServer);
    const response1 = await client.execute(commands.cmd1);

    expect(response1.data?.nodes?.length).toBeGreaterThan(0);
    expect(response1.data?.relationships?.length).toBeGreaterThan(0);

    await client.close();
  });

  test('test-case-2', async () => {
    const client = createClient(nebulaServer);

    const response1 = await client.execute(commands.cmd2);

    expect(response1.data?.node?.length).toBeGreaterThan(0);

    await client.close();
  });

  test('test-case-3', async () => {
    const client = createClient(nebulaServer);

    const response1 = await client.execute(commands.cmd3);

    expect(response1.data?.a?.length).toBeGreaterThan(0);
    expect(response1.data?.b?.length).toBeGreaterThan(0);
    expect(response1.data?.p?.length).toBeGreaterThan(0);

    await client.close();
  });

  test('test-case-4', async () => {
    const client = createClient(nebulaServer);

    const response1 = await client.execute(commands.cmd4);

    expect(response1.data?.p?.length).toBeGreaterThan(0);

    await client.close();
  });

  test('test-case-5-list', async () => {
    const client = createClient(nebulaServer);

    const response1 = await client.execute(commands.cmd5);

    expect(response1.data?.a).toStrictEqual([[1, 2, 3]]);

    await client.close();
  });

  test('test-case-6-list', async () => {
    const client = createClient(nebulaServer);

    const response1 = await client.execute(commands.cmd6);

    expect(response1.data?.a).toStrictEqual([
      [1, 2, 3],
      [2, 3, 4],
    ]);

    await client.close();
  });

  test('test-case-7-set', async () => {
    const client = createClient(nebulaServer);

    const response1 = await client.execute(commands.cmd7);

    expect(response1.data?.a?.length).toEqual(1);
    expect(response1.data?.a[0]?.length).toEqual(3);

    await client.close();
  });

  test('test-case-8-map', async () => {
    const client = createClient(nebulaServer);

    const response1 = await client.execute(commands.cmd8);

    expect(response1.data?.a?.length).toEqual(1);
    expect(response1.data?.a[0]?.a).toStrictEqual([1, 2]);
    expect(response1.data?.a[0]?.b?.length).toEqual(2);
    expect(response1.data?.a[0]?.c).toEqual('hee');

    await client.close();
  });
});
