/**
 * Created by Wu Jian Ping on - 2021/06/10.
 */

class NebulaError extends Error {
  public code = 'ERR_NEBULA'
  public errno = 0;
  constructor(errno: number, message: string) {
    super(message)
    this.errno = errno
  }
}

export default NebulaError
