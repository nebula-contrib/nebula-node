/* eslint-disable max-len */
/**
 * Created by Wu Jian Ping on - 2021/06/09.
 */

import createClient, { ClientOption } from '../dist'

import { expect } from 'chai'

const nebulaServer: ClientOption = {
  servers: ['10.0.5.10:9669'],
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
  cmd4: 'find noloop path with prop from "p001" to "p002" over * yield path as p'
}

describe('nebula', () => {
  it('test-case-1', async () => {
    const client = createClient(nebulaServer)
    const response1 = await client.execute(commands.cmd1)

    expect(response1.data?.nodes?.length).greaterThan(0)
    expect(response1.data?.relationships?.length).greaterThan(0)

    await client.close()
  })

  it('test-case-2', async () => {
    const client = createClient(nebulaServer)

    const response1 = await client.execute(commands.cmd2)

    expect(response1.data?.node?.length).greaterThan(0)

    await client.close()
  })

  it('test-case-3', async () => {
    const client = createClient(nebulaServer)

    const response1 = await client.execute(commands.cmd3)

    expect(response1.data?.a?.length).greaterThan(0)
    expect(response1.data?.b?.length).greaterThan(0)
    expect(response1.data?.p?.length).greaterThan(0)

    await client.close()
  })

  it('test-case-4', async () => {
    const client = createClient(nebulaServer)

    const response1 = await client.execute(commands.cmd4)

    expect(response1.data?.p?.length).greaterThan(0)

    await client.close()
  })

  after(async () => {
    process.exit()
  })
})


