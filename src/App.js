import { useEffect, useState } from 'react';
import './App.css';
import { getAllPokenmon,getPokemon } from './utils/pokemon';


import Card  from './components/Card';
import Navbar from './components/Navbar/Navbar';


function App() {
  const initialURL = "https://pokeapi.co/api/v2/pokemon";
  const [loading,setLoading] = useState(true);

 const [pokemonData,setPokemonData] = useState([]);
 const [nextUrl,setNextUrl] = useState("");
 const [prevUrl,setPrevUrl] = useState("");
  
  //pokemonAPI情報取得の呼び出し
  useEffect(() => {
    const fetchPokemonData = async () => {
      let res = await getAllPokenmon(initialURL);
      loadPokemon(res.results);
      setNextUrl(res.next);
      setPrevUrl(res.previous);
      //console.log(res);
      setLoading(false);
    }
    fetchPokemonData();
  }, []);

  const loadPokemon = async (data)=>{
   let _pokemonData = await Promise.all(
  data.map((pokemon)=>{
   // console.log(pokemon);
   let pokemonRecord = getPokemon(pokemon.url);
   return pokemonRecord;
  })
)
setPokemonData(_pokemonData);
  }

 
  const handleNextPage = async ()=>{
setLoading(true);
    let data = await getAllPokenmon(nextUrl);
     await loadPokemon(data.results);
     setNextUrl(data.next);
     setPrevUrl(data.previous);
     setLoading(false);
//console.log(data);

  };
  const handlePrevPage =async ()=>{
if (!prevUrl) return;
    setLoading(true);
    let data = await getAllPokenmon(prevUrl);
     await loadPokemon(data.results);
     setNextUrl(data.next);
     setPrevUrl(data.previous);
     setLoading(false);
  };

  return (
    <>
    <Navbar />
    <div className="App">
      {loading ?(<h1>ロード中....</h1>) : (
        <>
<div className='pokemonCardContainer'>
{pokemonData.map((pokemon,i)=>{

  return <Card key={i} pokemon={pokemon} />;
})}
</div>
<div className='btn'>
  <button onClick={handlePrevPage}>前へ</button> 
  <button onClick={handleNextPage}>次へ</button> 
</div>
</>
      )}
    </div>
    </>
  );
}

export default App;