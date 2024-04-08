async function handleSubmit(e) {
  e.preventDefault();

  const prompt = messageRef.current.value;

  setLoading(true);

  let newMessageList = [
    ...messages,
    {
      role: "user",
      content: prompt,
    },
  ];

  try {
    const response = await fetch("/api/bot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: newMessageList }),
    });

    if (!response.ok) {
      return;
    }

    const data = await response.json();

    newMessageList.push({
      role: data.response.message.role,
      content: data.response.message.content,
    });

    setMessages(newMessageList);
    setDisplayMessage(data.response.message.content);
    messageRef.current.value = "";
  } catch (error) {
    console.log(error.message);
  } finally {
    setLoading(false);
  }
}

export { handleSubmit };
