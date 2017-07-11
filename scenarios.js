module.exports = [
  {
    label: 'This is my scenario label',
    url: '/some/scenario/url',
    useCases: [
      {
        label: 'use case 1',
        query: '?token=1234-token',
        body: { items: ['foo', 'bar'] }
      },
      {
        label: 'use case 2',
        query: '?token=1235-token',
        body: { items: ['baz', 'foobar'] }
      }
    ]
  }
]
