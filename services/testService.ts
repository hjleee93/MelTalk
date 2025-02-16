import { google } from 'googleapis';
const gmail = google.gmail('v1');

export const getTests = async () => {
  const PROJECT_ID = process.env.PROJECT_ID
  const TOPIC_NAME = process.env.TOPIC_NAME
  const res = await gmail.users.watch({
    userId: 'hjleee93',
    requestBody: {
      // Replace with `projects/${PROJECT_ID}/topics/${TOPIC_NAME}`
      topicName: `projects/${PROJECT_ID}/topics/${TOPIC_NAME}`
    }
  });
  console.log(res.data);
  return [
    { id: 1, name: "test1" },
    { id: 2, name: "test2" },
  ];
};

export default { getTests };
