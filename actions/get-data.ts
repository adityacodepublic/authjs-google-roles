"use server"

const URL=`${process.env.G_DATA_URL}?action=getData&api=${process.env.G_DATA_API_KEY}`;

const getData = async (number:number) => {
  const res = await fetch(`${URL}&number=${number}`, {next: {tags:['g-data']}});
  return res.json();
};

export default getData;