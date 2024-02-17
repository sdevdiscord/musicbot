const {PostHog} = require('posthog-node')

const client = new PostHog(
    'phc_To2KFSGIZvTflmh4iasmM9cJ06r56vvWAkhoepIigK5',
    { host: 'https://eu.posthog.com' }
)

client.capture({
    distinctId: 'test-id',
    event: 'test-event'
})

// Send queued events immediately. Use for example in a serverless environment
// where the program may terminate before everything is sent
client.flush()