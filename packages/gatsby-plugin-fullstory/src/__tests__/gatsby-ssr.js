const { onRenderBody } = require(`../gatsby-ssr`)

const defaultNodeEnv = global.process.env.NODE_ENV

describe(`gatsby-plugin-fullstory`, () => {
  beforeEach(() => {
    global.process.env.NODE_ENV = `production`
  })

  afterEach(() => {
    global.process.env.NODE_ENV = defaultNodeEnv
  })

  it(`should inject tracking code`, async () => {
    const pluginOptions = {
      fs_org: `LOREM`,
    }

    const setHeadComponents = jest.fn()

    await onRenderBody(
      {
        setHeadComponents,
      },
      pluginOptions
    )

    expect(setHeadComponents).toMatchSnapshot()
    expect(setHeadComponents).toHaveBeenCalledTimes(1)

    const config = setHeadComponents.mock.calls[0][0][0]
    expect(config.props.dangerouslySetInnerHTML.__html).toContain(
      `window['_fs_org'] = 'LOREM'`
    )
  })

  it(`should inject tracking code in non-whitelisted pages`, async () => {
    const pluginOptions = {
      fs_org: `LOREM`,
      exclude: [`/lorem/ipsum/`],
    }

    const setHeadComponents = jest.fn()
    const pathname = `/dolor/amet`

    await onRenderBody(
      {
        setHeadComponents,
        pathname,
      },
      pluginOptions
    )

    expect(setHeadComponents).toMatchSnapshot()
    expect(setHeadComponents).toHaveBeenCalledTimes(1)

    const config = setHeadComponents.mock.calls[0][0][0]
    expect(config.props.dangerouslySetInnerHTML.__html).toContain(
      `window['_fs_org'] = 'LOREM'`
    )
  })

  it(`should not inject tracking code in whitelisted pages `, async () => {
    const pluginOptions = {
      fs_org: `LOREM`,
      exclude: [`/lorem/ipsum/`],
    }

    const setHeadComponents = jest.fn()
    const pathname = `/lorem/ipsum/`

    await onRenderBody(
      {
        setHeadComponents,
        pathname,
      },
      pluginOptions
    )

    expect(setHeadComponents).toMatchSnapshot()
    expect(setHeadComponents).toHaveBeenCalledTimes(0)
  })
})
