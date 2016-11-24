'use strict'

const firstOfEntityRole = function(message, entity, role) {
  role = role || 'generic';

  const slots = message.slots
  const entityValues = message.slots[entity]
  const valsForRole = entityValues ? entityValues.values_by_role[role] : null

  return valsForRole ? valsForRole[0] : null
}

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

    extractInfo() {
      const pld = firstOfEntityRole(client.getMessagePart(), 'plaats_delict')

      if (pld) {
        client.updateConversationState({
          plaats: pld,
        })

        console.log('Gebruiker wil: ', pld.value)
      }
    },
    prompt() {
      client.addResponse('app:response:name:prompt/plaats_delict')
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
