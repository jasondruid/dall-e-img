import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Loader, Card, FormField } from '../components';

const RenderCards = ({ data, title }) => {
    if (data?.length > 0) return data.map((post) => <Card key={post._id} {...post} />);
    return <h2 className='mt-5 font-bold text-[#6449ff] text-xl uppercase'>{title}</h2>
};

const Home = () => {

    const [loading, setLoading] = useState(false);
    const [allPosts, setAllPosts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchedResults, setSearchedResults] = useState(null);
    const [searchTimeout, setSearchTimeout] = useState(null);
    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/v1/post')
                const data = response.data;
                console.log(data.data);
                setAllPosts(data.data.reverse());
            }
            catch (error) {
                alert(error);
            }
            finally {
                setLoading(false);
            }

        }
        fetchPost();
    }, []);

    const handleSearchChange = (e) => {
        console.log(e);
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);
        setSearchTimeout(setTimeout(() => {
            const searchResult = allPosts.filter((item) => item.name.toLowerCase().includes(searchText.toLowerCase()) || item.prompt.toLowerCase().includes(searchText.toLowerCase()));

            setSearchedResults(searchResult);
        }, 700));


    }

    return (
        <section className='max-w-7xl mx-auto'>
            <div>
                <h1 className='font-extrabold text-[#222328] text-[32px] dark:text-gray-200'>The Community Showcase</h1>
                <p className='mt-2 text-[#666e75]  text-[16px] max-w-[500px] dark:text-gray-400'>Browse through a collection of imaginative and visually stunning images generated by DALL-e AI</p>
            </div>
            <div class="backdrop-blur-sm bg-white/30 ...">
            </div>
            <div className='mt-16'>
                <FormField labelName="Search Post" type="text" name="text" placeholder="Search posts" value={searchText} handleChange={handleSearchChange} />
            </div>
            <div className='mt-10'>
                {loading ? (<div className='flex justify-center'>
                    <Loader />
                </div>) : (<> 
                    {searchText && <h2 className='font-medium text-[#666e75] text-xl mb-3 dark:text-gray-400' >Showing results for <span className='text-[#222328] dark:text-gray-200'>{searchText}</span></h2>}
                    <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
                        {searchText ? (<RenderCards data={searchedResults} title="No search results found"></RenderCards>) :
                            (<RenderCards data={allPosts} title="No Posts found" />)}
                    </div>
                </>)}
            </div>

        </section>
    )
}

export default Home