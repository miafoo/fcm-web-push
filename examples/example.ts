import fs from "fs"
import {
  FcmClient,
  FcmRegistration,
  decodeRegistration,
  encodeRegistration,
  register,
} from "../src"

const config = {
  // Firebase config when creating a "Web app" in the Firebase console
  apiKey: "xxxx",
  projectId: "xxxx",
  appId: "xxxx",
  // You find the `vapidKey` by going to:
  // "Cloud Messaging" tab > Web configuration > Web push certificates > Key pair
  vapidKey: "xxxx",
}

const main = async () => {
  const registration = await getRegistration()
  const storedPersistentIds = readPersistentIdsFromDisk()
  const persistentIds: string[] = []

  console.log({
    registration,
    storedPersistentIds,
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
    persistentIds.push(message.persistentId)
    console.log(message)
  })

  // Close the client if someone tries to close the process.
  process.on("SIGINT", async () => {
    await client.disconnect()
    process.exit(0)
  })

  await client.connect(storedPersistentIds)

  writePersistentIdsToDisk(persistentIds)
}

const readPersistentIdsFromDisk = (): string[] => {
  try {
    const readPersistentIds = fs.readFileSync("persistentIds.json", "utf8")
    const persistentIds: string[] = JSON.parse(readPersistentIds)
    if (!Array.isArray(persistentIds)) {
      throw new Error("Not an array")
    }
    return persistentIds
  } catch {
    return []
  }
}

const writePersistentIdsToDisk = (persistentIds: string[]) => {
  fs.writeFileSync("persistentIds.json", JSON.stringify(persistentIds, null, 2))
}

const getRegistration = async (): Promise<FcmRegistration> => {
  try {
    console.log("Reading registration from disk...")
    const registration = fs.readFileSync("registration.json", "utf8")
    return decodeRegistration(registration)
  } catch {
    console.log("Registering...")
    const registration = await register(config)
    console.log("Writing registration to disk...")
    fs.writeFileSync("registration.json", encodeRegistration(registration))
    return registration
  }
}

main()
