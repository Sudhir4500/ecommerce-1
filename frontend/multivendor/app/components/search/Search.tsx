'use client';

import { useRouter } from "next/navigation";


const Search = () => {
    const router = useRouter();
    

    const handlesearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;

        if (name) {
            // Redirect to the search results page with the query term
            router.push(`/search/${name}`);
        }
    };

    return (
        <form
            onSubmit={handlesearch}
            className="flex items-center gap-4 bg-gray-100 p-2 rounded-md border w-full max-w-md mx-auto"
        >
            <input
                type="text"
                name="name"
                placeholder="Search for products or category..."
                className="outline-none bg-transparent w-full flex-1 min-w-0 transition-all duration-300 md:focus:w-[150%]"
            />
            <button type="submit" className="cursor-pointer shrink-0">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                </svg>
            </button>
        </form>
    );
};

export default Search;