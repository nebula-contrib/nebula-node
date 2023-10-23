/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * Created by Wu Jian Ping on - 2021/02/09.
 */

import { describe, expect, test } from '@jest/globals';
import { bytesToLongLongString, hash64 } from '../src/native'

describe('native', () => {
  test('bytesToLongLongString', () => {
    const s = '-7897618527020261406'
    const buffer = [146, 102, 5, 203, 5, 105, 223, 226]
    expect(bytesToLongLongString(buffer)).toBe(s)
  })

  test('hash64', () => {
    const testData = [
      { keyNo: 'f10011b64aa4e7503cd45a7fdc24387b', a: '2852836996923339651', b: '-6853534673140605817' },
      { keyNo: 'f1bc319830aa4bd525b6b211fc128e5e', a: '-6331077761356739522', b: '6750279366282124699' },
      { keyNo: '848c2247822de0cb0143fd2284e5f49b', a: '-1555622337850244510', b: '-8339851874587677509' },
      { keyNo: '39412b3210c9a90f57ed1b38f1ae5a96', a: '6335982877265857990', b: '55408194587693294' },
      { keyNo: 'd110e448414767c3ee0498ebaafdcb4c', a: '-9216753512906688549', b: '-3612251988277645781' },
      { keyNo: 'cd7a64c13428ff1c5ad360b897e6213e', a: '-9135184246841545171', b: '-7893021274965809506' },
      { keyNo: 'a19b9f1f81360d389dbb43be9c93dcf7', a: '1084042973936465014', b: '-4544464519873256813' },
      { keyNo: '1c15b9f300492a3ddf7b9a1fb4d9b36d', a: '3094932043023682280', b: '1125186911550860797' },
      { keyNo: 'a0ce03cae61b5a4ecdda6b1c097e852b', a: '-815261362631421691', b: '-6084967328293009104' },
      { keyNo: '691f9c7ebaec8737e82c235f8eff7b1f', a: '-8273291170295048949', b: '2805393060663296931' },
      { keyNo: '09ff4e3922b01b99a286dec895df828b', a: '1646294263843434261', b: '6154917800715546974' },
      { keyNo: '5608c68f0f84a28a5c8c0479ebbd69c1', a: '8004344832703457518', b: '4306029215693896848' },
      { keyNo: '科技型企业', a: '-6865176517154056019', b: '8588244832922351093' }
    ]
    
    for (const sample of testData) {
      const data = hash64(sample.keyNo)
      expect(data[0]).toBe(sample.a)
      expect(data[1]).toBe(sample.b)
    }
  })
})
