'use strict'

exports.handle = function handle(client) {
  const sayHello = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().helloSent)
    },

    prompt() {
      client.addResponse('welcome')
      client.addResponse('provide/documentation', {
        documentation_link: 'http://docs.init.ai',
      })
      client.addResponse('provide/instructions')
      client.updateConversationState({
        helloSent: true
      })
      client.done()
    }
  })

  const untrained = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      client.addResponse('apology/untrained')
     client.done()
    }
  })

  const collectPlaatsDelict = client.createStep({
    satisfied() {
      return Boolean(client.getConversationState().plaats)
    },

    prompt() {
      // Need to prompt user for city
      console.log('Vraag gebruiker om plaats delict')
      client.done()
    },
  })

  const provideCoord = client.createStep({
    satisfied() {
      return false
    },

    prompt() {
      // Need to provide coordinaten
      client.done()
    },
  })

  client.runFlow({
    classifications: {},
    streams: {
      main: 'getPlaatsDelict',
      hi: [sayHello],
      getPlaatsDelict: [collectPlaatsDelict, provideCoord],
    }
  })
}
