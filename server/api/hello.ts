// helth 

export default defineEventHandler(async () => {
  return {
    status: 200,
    body: { message: "Hello, World!" },
  };
});
