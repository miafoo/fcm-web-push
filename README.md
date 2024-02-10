[![npm version](https://badge.fury.io/js/@miafoo%2Ffcm-web-push.svg)](https://badge.fury.io/js/@miafoo%2Ffcm-web-push)

A very minimal web push notification server using Firebase Cloud Messaging (FCM) for Node (and Electron).

# Installation

```bash
npm install @miafoo/fcm-web-push
```

# Prerequisites

1. Firebase App ID
2. Firebase Project ID
3. Firebase API Key
4. Firebase VAPID/Key Pair

You can find the first 3 in the Firebase Console when you create a new "Web app". The VAPID/Key pair can be found in the "Web configuration" section on the "Cloud Messaging" tab.

# Usage

See [examples](./examples/) folder for more complete examples than the one below.

```typescript
import { register, FcmClient } from "@miafoo/fcm-web-push"

// Restore persistentIds from the previous session.
const previousPersistentIds: string[] = readPersistentIdsFromDisk()
const newPersistentIds: string[] = []

// Register the app with Firebase. Ideally you would store this registration
// and restore it next time you run the app.
// You can use the `encodeRegistration` and `decodeRegistration` functions
// to easily save and restore the registration as JSON strings.
// Note: Registration can take several seconds.
const registration = await register({
  apiKey: "xxxx",
  projectId: "xxxx",
  appId: "xxxx",
  vapidKey: "xxxx",
})

const client = new FcmClient({
  registration,
})

client.on("connect", () => {
  console.log("Connecting...")
})

client.on("connected", () => {
  console.log("Connected!")
})

client.on("disconnected", () => {
  console.log("Disconnected!")
})

client.on("message", (message) => {
  // Store the `persistentId`!
  newPersistentIds.push(message.persistentId)
  console.log(message)
})

// Pass in the `previousPersistentIds` to mark them seen, otheriwse they
// will be received again every time the client connects.
await client.connect(previousPersistentIds)
// Note: The `connect` promise resolves when the socket is closed.
// You can also close the socket manually by disconnecting:
client.disconnect()

// Save the new persistent ids so we can mark them seen next time we run.
writePersistentIdsToDisk(newPersistentIds)
```

# Acknowledgements

- [push-receiver](https://github.com/MatthieuLemoine/push-receiver) for the original implementation. Be sure to check out Matthieu Lemoine's [blog post](https://medium.com/@MatthieuLemoine/my-journey-to-bring-web-push-support-to-node-and-electron-ce70eea1c0b0) on how they built it.
- [fcm-push-listener](https://github.com/RandomEngy/fcm-push-listener) for a simple Rust implementation. Large portion of this code is based on it.
- Google & Chrome Developer blogs for the [Web Push Protocol](https://developers.google.com/web/fundamentals/push-notifications/web-push-protocol) and [Web Push Encryption](https://developer.chrome.com/blog/web-push-encryption).
