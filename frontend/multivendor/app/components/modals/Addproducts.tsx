'use client';

import usepropertylistingModal from '@/app/hooks/usepropertylisting'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Modal from './Modal'
import apiService from '@/app/services/apiservice'
import CategoriesList from '../category/CategoriesList';
import Custombutton from '../forms/Custombutton';


const Addproducts = () => {
const[productname,setproductname]=useState('')
const[productprice,setproductprice]=useState('')
const[image,setimage]=useState<File|null>(null)
const[category,setcategory]=useState('')
const[stock,setstock]=useState('')
const[description,setdescription]=useState('')
const[currentpage,setcurrentpage]=useState(1)

const productlisting=usepropertylistingModal()
const router=useRouter()

const setCategory = (category: string) => {
  setcategory(category)
}

const handlesubmit = async () => {
  console.log("Product Name:", productname);
  console.log("Product Price:", productprice);
  console.log("Image:", image);
  console.log("Category:", category);
  console.log("Stock:", stock);
  console.log("Description:", description);

  if (
    productname.trim() &&
    productprice &&
    image &&
    category.trim() &&
    stock &&
    description.trim()
  ) {
    const formData = new FormData();
    formData.append('productname', productname);
    formData.append('productprice', productprice);
    formData.append('image', image);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('description', description);

    try {
      const response = await apiService.post("/api/products/products/", formData);
      console.log("Response:", response); // Log the response to check the structure

      if (response.success) {
        productlisting.close();
        router.push('/');
      } else {
        alert('Failed to add product');
      }
    } catch (error) {
      console.error("Error adding product:", error); // Log any errors that occur
      alert('Failed to add product');
    }
  } else {
    alert('Please fill in all fields');
  }
};



const handleimage = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setimage(file);
  }
};

const content=(
  <>
  {currentpage===1 ? (
<>
<input
type='text'
placeholder='product name'
value={productname}
onChange={(e)=>setproductname(e.target.value)}
className='w-full p-2 border border-gray-300 rounded-md focus:outline-none'
/>
<h2 className=' mt-4'>select one category</h2>
<hr/>
<CategoriesList category={category} 

setcategories={setCategory} />

<Custombutton
label='Next'
onclick={()=>setcurrentpage(2)}
/>
</>

  ):(
<>
<input
type='number'
placeholder='product price'
value={productprice}
onChange={(e)=>setproductprice(e.target.value)}/>
<input
type='file'
onChange={handleimage}/>

<input
type='text'
placeholder='description'
value={description}
onChange={(e)=>setdescription(e.target.value)}/>
<input
type='number'
placeholder='stock'
value={stock}
onChange={(e)=>setstock(e.target.value)}/>

<div className=' flex space-x-4'>
<Custombutton
label='Previous'
onclick={()=>setcurrentpage(1)}/>
<Custombutton

label='submit'
onclick={handlesubmit}/>
</div>
</>
  )}
  
  </>
)
  return (
    <>
    <Modal
    label='Add Product'
    isOpen={productlisting.isOpen}
    close={productlisting.close}
    content={content}/>
    </>
  )
}

export default Addproducts
