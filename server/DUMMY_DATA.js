const booklist = [];
const conditions = ["bad", "ok", "good"];
for (let i = 0; i < 100; i++) {
  booklist.push({
    userId: `userId-${Math.floor(Math.random() * 30)}`,
    title: `Book Title ${Math.floor(Math.random() * 80)}`,
    author: `Author ${Math.floor(Math.random() * 30)}`,
    condition: conditions[Math.floor(Math.random() * 3)],
    price: +`${Math.floor(Math.random() * 10)}` + 0.99,
  });
}

export default booklist;
