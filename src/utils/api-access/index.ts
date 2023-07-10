export const getImgSrc = async (public_id:string) => {
    const response = await fetch('/api/products/get-product-pic', {
        method: 'POST',
        body: JSON.stringify({ public_id }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
  
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error || 'Something went wrong!');
    }
    
    return data.url 
}