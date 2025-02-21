import { PubSub } from "@google-cloud/pubsub";

import serviceAccount from '../meltalk-dev-service-account.json';

const PROJECT_ID = process.env.PROJECT_ID
const TOPIC_NAME = process.env.TOPIC_NAME
const SUBSCRIPTION_NAME = process.env.SUBSCRIPTION_NAME



export async function pubSubStart(
  projectId = PROJECT_ID,
  topicNameOrId = TOPIC_NAME,
  subscriptionName = SUBSCRIPTION_NAME
) {

  const pubsub = new PubSub({
    projectId,
    credentials: {
      client_email: serviceAccount.client_email,
      private_key: serviceAccount.private_key,
    }
  });

  let topic = pubsub.topic(topicNameOrId);
  const [topicExists] = await topic.exists();

  let subscription = pubsub.subscription(subscriptionName);

  if (!topicExists) {
    const [newTopic] = await pubsub.createTopic(topicNameOrId);
    topic = newTopic; // 외부 topic 변수에 재할당
    [subscription] = await topic.createSubscription(subscriptionName);
  }


  // Receive callbacks for new messages on the subscription
  subscription.on('message', message => {
    console.log('Received message:', message.data.toString());
  });

  // Receive callbacks for errors on the subscription
  subscription.on('error', error => {
    console.error('Received error:', error);
    process.exit(1);
  });
}