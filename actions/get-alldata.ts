"use server"

const URL=`${process.env.G_DATA_URL}?action=getAllData&api=${process.env.G_DATA_API_KEY}`;

const getAllData = async () => {
  const res = await fetch(`${URL}`, {next: {tags:['g-data']}});
  return res.json();
};

export default getAllData;