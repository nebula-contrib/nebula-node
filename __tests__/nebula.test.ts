/* eslint-disable max-len */
/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import createClient, { type ClientOption } from '../src';
import { describe, expect, test } from '@jest/globals';

const defaultClientOption: ClientOption = {
  servers: ['127.0.0.1:9669'],
  userName: 'root',
  password: 'nebula',
  space: 'nebula_node',
  pingInterval: 5000,
  poolSize: 1
}

const executeCmd = async (cmd: string, clientOption = defaultClientOption) => {
  const client = createClient(clientOption);
  const response = await client.execute(cmd);
  return {
    response,
    async [Symbol.asyncDispose]() {
      await client.close();
    },
  };
};

const testCases = [
  {
    name: 'getSubgraph',
    cmd: 'get subgraph with prop 2 steps from "p001" yield vertices as nodes, edges as relationships',
    valid: (res: any) => {
      expect(res.data?.nodes?.length).toBeGreaterThan(0);
      expect(res.data?.relationships?.length).toBeGreaterThan(0);
    },
  },
  {
    name: 'fetProps',
    cmd: 'fetch prop on company "c001" yield properties(vertex) as node',
    valid: (res: any) => {
      expect(res.data?.node?.length).toBeGreaterThan(0);
    },
  },
  {
    name: 'goFrom',
    cmd: 'go from "c001" over employee yield properties($^) as a, properties($$) as b, properties(edge) as p',
    valid: (res: any) => {
      expect(res.data?.a?.length).toBeGreaterThan(0);
      expect(res.data?.b?.length).toBeGreaterThan(0);
      expect(res.data?.p?.length).toBeGreaterThan(0);
    },
  },
  {
    name: 'findNoloopPath',
    cmd: 'find noloop path with prop from "p001" to "p002" over * yield path as p',
    valid: (res: any) => {
      expect(res.data?.p?.length).toBeGreaterThan(0);
    },
  },
  {
    name: 'returnList',
    cmd: 'RETURN list[1, 2, 3] AS a',
    valid: (res: any) => {
      expect(res.data?.a).toStrictEqual([[1, 2, 3]]);
    },
  },
  {
    name: 'unwindList',
    cmd: 'UNWIND list[list[1, 2, 3], list[2, 3, 4]] as a RETURN a',
    valid: (res: any) => {
      expect(res.data?.a).toStrictEqual([
        [1, 2, 3],
        [2, 3, 4],
      ]);
    },
  },
  {
    name: 'returnSet',
    cmd: 'RETURN set{1, 2, 3} AS a',
    valid: (res: any) => {
      expect(res.data?.a?.length).toEqual(1);
      expect(res.data?.a[0]?.length).toEqual(3);
    },
  },
  {
    name: 'returnMap',
    cmd: 'RETURN map{a: LIST[1,2], b: SET{1,2,1}, c: "hee"} as a',
    valid: (res: any) => {
      expect(res.data?.a?.length).toEqual(1);
      expect(res.data?.a[0]?.a).toStrictEqual([1, 2]);
      expect(res.data?.a[0]?.b?.length).toEqual(2);
      expect(res.data?.a[0]?.c).toEqual('hee');
    },
  },
  {
    name: 'explain',
    cmd: 'EXPLAIN format="dot" match (v) return v limit 3',
    valid: (res: any) => {},
  },
];

describe('nebula', () => testCases.forEach((testCase) => {
  test(testCase.name, async () => {
    await using result = await executeCmd(testCase.cmd);
    testCase.valid(result.response);
  });
}));
