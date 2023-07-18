import { useState, useEffect, useContext, FunctionComponent, ChangeEvent } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
//import { getCategories, searchList } from '../../api/api-core';
import { CartContext } from '@/context/cartContext';
import { ResetableSearch, SelectInput } from './Inputs';
import { ProductCard } from './ProductCard';
import { ICategoryData, IProduct } from '../../types';

const pageSize = 10;
let _isLoaded = false;

interface ISearch {
    toggleSearchResultDisplayed: (param:boolean)=>void;
    searchResultDisplayed: boolean;
}

interface ICategory {
    category:string; _id?:string
}

interface IData {
    search:string;
    results: IProduct[];
    searched:boolean;
}
export const Search: FunctionComponent<ISearch> = ({ toggleSearchResultDisplayed, searchResultDisplayed }) => {
    const [data,setData] = useState<IData>({		
		search: '',
		results: [],
		searched: false		
	});
	
	const [mainCategories, setMainCategories] = useState<ICategoryData[]>([]);
	const [categories, setCategories] = useState<ICategory[]>([{category:'All Categories'}]);
	const [categoryIdx, setCategoryIdx] = useState(0);
	const [options, setOptions] = useState<ICategory[]>([{category:'All Options'}]);
	const [optionIdx, setOptionIdx] = useState(0);
	const [subOptions, setSubOptions] = useState<ICategory[]>([{category:'All Sub Options'}]);
	const [subOptionIdx, setSubOptionIdx] = useState(0);

    const [loading, setLoading] = useState(false)
	
	const {search, results, searched } = data;	
	
	const [currentPage, setCurrentPage] = useState(0);
	const [maxPageReached, setMaxPageReached] = useState(false);

	const { productToDelete } =  useContext(CartContext) || {};

	const loadCategories = async () => {		
        try{
            const response = await fetch('/api/categories/list-categories')

            const categoryJson = await response.json()
            const categoryData = categoryJson.data;
            setMainCategories([...categoryData]);

            const newCategories = categoryData.map((d:ICategoryData) => {
                return {category:d.category, _id:d._id}
            });				
        
            setCategories([categories[0]].concat(newCategories));	
        }
        catch(err){

        }
        finally{
            setLoading(false)
        }
	}

	const initStates = () => {
		setData({		
			search: '',
			results: [],
			searched: false		
		});
		setCurrentPage(0);
		setMaxPageReached(false);
	}

	useEffect(() => {
		_isLoaded = true;
		if(mainCategories.length === 0 && _isLoaded){
			loadCategories();	
		}	
		
		!searchResultDisplayed && searched && resetSearch();
		//seems like the above line will never be reached, just let it be just in case....	
		return ()=>{
			_isLoaded = false;
		}	
	}, [searchResultDisplayed,]);

	useEffect(()=>{
		if(!_isLoaded){
			return;
		}
		if(productToDelete!==null){
			return;			
		}

		initStates();
		searchData();
	}, [productToDelete]);

    const searchData = async () => {		
		if(search!=='' || categoryIdx > 0){			
			const categoryId = categoryIdx > 0?categories[categoryIdx]._id:'';
			const optionId = optionIdx > 0?options[optionIdx]._id:'';
			const subOptionId = subOptionIdx > 0?subOptions[subOptionIdx]._id:'';

			const skip = pageSize * currentPage;
			const limit = pageSize;
            
			setLoading(true)
			try{
				const response = await fetch('/api/products/list-search/', {
					method: 'POST',
					body: JSON.stringify({search, categoryId, optionId, subOptionId, skip, limit}),
					headers: {
						'Content-Type': 'application/json',
					},
				});
	
				const newProducts = await response.json()

				const products = newProducts.products
				setData({...data, results:currentPage===0?products:results.concat(products), searched:true});							
				toggleSearchResultDisplayed(true);
				setCurrentPage(currentPage + 1);															
				products.length === 0 && setMaxPageReached(true);
			}
			catch(err){
				console.log('error getting products : ', err)
			}
			finally{
				setLoading(false)
			}
		}				
	}

    const categoryOption = (ctg:ICategory, i:number) => {
		const {category} = ctg;
		return (
			<option key={i} value={i}>{category}</option>
		);
	}
	
	const changeCategory = (evt:ChangeEvent<HTMLSelectElement>) => {
        const newIdx = parseInt(evt.target.value)
		setCategoryIdx(newIdx);
		if(newIdx > 0 && Array.isArray(mainCategories)){
            const mainCategory = mainCategories[newIdx - 1];
            if(typeof mainCategory !== 'undefined' && typeof mainCategory.options!=='undefined'){
                const newOptions = mainCategory.options.map(d => {return {category:d.category, _id:d._id}});
			    setOptions([options[0]].concat(newOptions));
            }
				
		}else{
			setOptions([options[0]]);
		}
		
		setOptionIdx(0);
		setSubOptions([subOptions[0]]);
		setSubOptionIdx(0);		
		undisplaySearchWhenChange(search);
	}
	
	const renderOption = (subCtg:ICategory, i:number) => <option key={i} value={i}>{subCtg.category}</option>

	const changeOption = (evt:ChangeEvent<HTMLSelectElement>) => {
        const newIdx = parseInt(evt.target.value)
		setOptionIdx(newIdx);
		if(newIdx > 0){
            const mainCategory = mainCategories[categoryIdx - 1]
            if(mainCategory && mainCategory.options && mainCategory.options[newIdx - 1] && mainCategory.options[newIdx - 1].options){
                const newSubOptions = mainCategory.options[newIdx - 1].options;

                if(Array.isArray(newSubOptions)){
                    const firstSubOptions = {category:((Array.isArray(newSubOptions) && newSubOptions.length>0)?'All Sub Options':'~----~')};
                    setSubOptions([firstSubOptions].concat(newSubOptions));    
                }			    			    
            }
			
		}else{
			setSubOptions([subOptions[0]]);
		}
		setSubOptionIdx(0);
		undisplaySearchWhenChange(search);
	}
	
	const renderSubOption = (subSubCtg:ICategory, i:number) => <option key={i} value={i}>{subSubCtg.category}</option>

	const changeSubOption = (evt:ChangeEvent<HTMLSelectElement>) => {
		setSubOptionIdx(parseInt(evt.target.value));
		undisplaySearchWhenChange(search);
	}

    const searchUI = () => {
		const categoryWidth = categoryIdx > 0?(optionIdx > 0?'md:basis-1/5':'md:basis-1/4'):'md:basis-1/3';
		const optionWidth = optionIdx > 0?'md:basis-1/5':'md:basis-1/4';
		const searchWidth = categoryIdx > 0?(optionIdx > 0?'md:basis-2/5':'md:basis-1/2'):'md:basis-2/3';

		return (
			<form 
				className='w-full flex flex-wrap md:flex-nowrap py-2 bg-white'
				noValidate 
				onSubmit={(e) =>{}}
			> 				
				
				<div className={`basis-full ${categoryWidth} px-3 mb-6 md:mb-0`}>
					<SelectInput
						selection={categories}
						selectionRender={categoryOption}
						controlValue={categoryIdx}
						controlChange={(evt)=>{changeCategory(evt);}}
					/>
				</div>                            
				
				{
					categoryIdx > 0 &&				
					<div className={`basis-full ${optionWidth} px-3 mb-6 md:mb-0`}>						
						<SelectInput
							selection={options}
							selectionRender={renderOption}
							controlValue={optionIdx}
							controlChange={(evt)=>{changeOption(evt);}}
						/>
					</div>				
				}
				{
					categoryIdx > 0 && optionIdx > 0 &&
					<div className={`basis-full md:basis-1/5 px-3 mb-6 md:mb-0`}>						
						<SelectInput
							selection={subOptions}
							selectionRender={renderSubOption}
							controlValue={subOptionIdx}
							controlChange={(evt)=>{changeSubOption(evt);}}
						/>
					</div>
				}
				<div className={`basis-full ${searchWidth} px-3 mb-6 md:mb-0`}>
					<ResetableSearch 
						placeholder='Search item name'
						searchClick={()=>{searchData();}}
						value={search}
						onChange={e=>{
							undisplaySearchWhenChange(e.target.value);
						}}
						resetSearch={resetSearch}
						searchDisabled={search === '' && categoryIdx === 0}
						searched={searched}
					/>
				</div>
			</form>
		);	
	}

    const resetSearch = () => {
		setCategoryIdx(0);setOptionIdx(0);setSubOptionIdx(0);
		setOptions([options[0]]);setSubOptions([subOptions[0]]);
		undisplaySearchWhenChange('')
	}

    const undisplaySearchWhenChange = (searchVal:string) => {
		setData({results:[], search:searchVal, searched:false});
      	setCurrentPage(0);setMaxPageReached(false);
      	searchResultDisplayed && toggleSearchResultDisplayed(false);
	}

    const searchedProducts = () => {
		return (
			<InfiniteScroll
    			pageStart={0}
    			loadMore={()=>searchData()}
    			hasMore={!maxPageReached}
    			loader={<h3>Loading...</h3>}    		
			>
				<div className='p-5 font-light border border-b-0 border-gray-200 flex items-center justify-around flex-wrap'>                    
					{results.length > 0 && results.map((p:IProduct,i:number) => 					
						<ProductCard 
							key={p._id} product={p} cardIn=''
						/>
					)}
				</div>
			</InfiniteScroll>
		)
	}

	const searchResultTitle = () => {
		let searchTermDisplay = '';
		if(search){
			searchTermDisplay = `Product name contains '${search}' `;
		}

		let searchCategoryText = '';		
		if(categoryIdx!==0){
			const selectedCategory = mainCategories[categoryIdx - 1];
			const {category} = selectedCategory;
			searchCategoryText+=category;
			if(optionIdx!==0){
                if(selectedCategory && Array.isArray(selectedCategory.options) 
                    && selectedCategory.options[optionIdx - 1] && selectedCategory.options[optionIdx - 1].category){

                    const selectedOption = selectedCategory.options[optionIdx-1]
                    let selectedOptionText = selectedOption.category;
                    searchCategoryText+=(' > ' + selectedOptionText);

                    if(subOptionIdx!==0 && Array.isArray(selectedOption.options)){
                        let selectedSubOption = selectedOption.options[subOptionIdx - 1].category;
                        searchCategoryText+=(' > ' + selectedSubOption);
                        //console.log(selectedOption)
                    }
                }								
			}
		}
		const searchCategoryDisplay = `${!search?'Searched ':''}in ${searchCategoryText}`

		return (
		 	<div className='px-3'>			
				<h2 className='text-lg font-bold'>
					Search Result  
				</h2>
				<p className='italic font-bold'>
					{searchTermDisplay}{categoryIdx > 0 && searchCategoryDisplay}					
				</p>
			</div>
		)
	}

    return (
        <>
        { searchUI() }
		{ searched && searchResultTitle() }
        { searched && 
			<>{
				results.length > 0 ? 
					searchedProducts():<h4 className='text-center'>~...No Result...~</h4> 
			}</>
		}        
        </>
    );
}