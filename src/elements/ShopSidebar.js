import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';
import {Accordion} from 'react-bootstrap';

import SlideDragable from './SlideDragable';
import {useCategories} from "../contexts/CategoryContext";
import {getPublishers} from "../services/publisher.service";
import {getPublishYears} from "../services/product.service";
import {useLoading} from "../contexts/LoadingContext";
import {getAuthors} from "../services/author.service";

const ShopSidebar = ({filterCriteria, setFilterCriteria, setShowSidebar}) =>{
    const { loadingDispatch } = useLoading();
    const categories = useCategories();
    const [authors, setAuthors] = useState([])
    const [publishers, setPublishers] = useState([]);
    const [years, setYears] = useState([]);

    useEffect(() => {
        fetchAuthors();
        fetchPublishers();
        fetchPublishYears();
    }, []);

    const fetchAuthors = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getAuthors();
            setAuthors(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const fetchPublishers = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getPublishers();
            setPublishers(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const fetchPublishYears = async () => {
        try {
            loadingDispatch({type: 'START_LOADING'});
            const response = await getPublishYears();
            setYears(response);
        } catch (error) {
            console.log(error);
        } finally {
            loadingDispatch({type: 'STOP_LOADING'});
        }
    }

    const renderCategoryCheckboxes = (categories, level = 0) => {
        return categories.map((item) => (
            <React.Fragment key={item.id}>
                <div className={`form-check search-content${level > 0 ? ' m-l20' : ''}`} >
                    <input
                        className="form-check-input"
                        type="checkbox"
                        id={`shopcategoryCheckBox-${item.id}`}
                        checked={filterCriteria.categoryIds.includes(item.id)}
                        onChange={() => handleCategoryToggle(item.id)}
                    />
                    <label className="form-check-label" htmlFor={`shopcategoryCheckBox-${item.id}`}>
                        {item.name}
                    </label>
                </div>
                {item.subCategories && item.subCategories.length > 0 && renderCategoryCheckboxes(item.subCategories, level + 1)}
            </React.Fragment>
        ));
    };

    const handleCategoryToggle = (categoryId) => {
        const updatedSelectedCategoryIds = [...filterCriteria.categoryIds];

        if (updatedSelectedCategoryIds.includes(categoryId)) {
            // If the category is already selected, remove it
            const index = updatedSelectedCategoryIds.indexOf(categoryId);
            updatedSelectedCategoryIds.splice(index, 1);
        } else {
            // If the category is not selected, add it
            updatedSelectedCategoryIds.push(categoryId);
        }

        // Handle the subcategories
        categories.forEach((category) => {
            if (category.id === categoryId) {
                if (updatedSelectedCategoryIds.includes(category.id)) {
                    // If the category is checked, add all subcategories
                    category.subCategories.forEach((subCategory) => {
                        if (!updatedSelectedCategoryIds.includes(subCategory.id)) {
                            updatedSelectedCategoryIds.push(subCategory.id);
                        }
                    });
                } else {
                    // If the category is unchecked, remove it and its subcategories
                    updatedSelectedCategoryIds.splice(updatedSelectedCategoryIds.indexOf(category.id), 1);
                    category.subCategories.forEach((subCategory) => {
                        const subCategoryIndex = updatedSelectedCategoryIds.indexOf(subCategory.id);
                        if (subCategoryIndex !== -1) {
                            updatedSelectedCategoryIds.splice(subCategoryIndex, 1);
                        }
                    });
                }
            }
        });

        // Update the filterCriteria with the updated category IDs
        setFilterCriteria({
            ...filterCriteria,
            categoryIds: updatedSelectedCategoryIds,
        });
    };

    const handleAuthorToggle = (authorId) => {
        // Create a copy of the selected publishers array
        const updatedSelectedAuthors = [...filterCriteria.authorIds];

        // If the publisher is already selected, unselect it; otherwise, select it
        if (updatedSelectedAuthors.includes(authorId)) {
            const index = updatedSelectedAuthors.indexOf(authorId);
            updatedSelectedAuthors.splice(index, 1);
        } else {
            updatedSelectedAuthors.push(authorId);
        }

        // Update the filterCriteria with the selected publishers
        setFilterCriteria({
            ...filterCriteria,
            authorIds: updatedSelectedAuthors,
        });
    };

    const handlePublisherToggle = (publisherId) => {
        // Create a copy of the publisher IDs array in filterCriteria
        const updatedPublisherIds = [...filterCriteria.publisherIds];

        if (updatedPublisherIds.includes(publisherId)) {
            const index = updatedPublisherIds.indexOf(publisherId);
            updatedPublisherIds.splice(index, 1);
        } else {
            updatedPublisherIds.push(publisherId);
        }

        // Update the filterCriteria with the updated publisher IDs
        setFilterCriteria({
            ...filterCriteria,
            publisherIds: updatedPublisherIds,
        });
    };

    const handleYearToggle = (year) => {
        // Create a copy of the selected years array in filterCriteria
        const updatedSelectedYears = [...filterCriteria.publishYears];

        // If the year is already selected, unselect it; otherwise, select it
        if (updatedSelectedYears.includes(year)) {
            const index = updatedSelectedYears.indexOf(year);
            updatedSelectedYears.splice(index, 1);
        } else {
            updatedSelectedYears.push(year);
        }

        // Update the filterCriteria with the selected years
        setFilterCriteria({
            ...filterCriteria,
            publishYears: updatedSelectedYears,
        });
    };


    return(
        <>
            <div className="shop-filter">
                <div className="d-flex justify-content-between">
                    <h4 className="title">Filter Option</h4>
                    <Link
                        className="panel-close-btn"
                        onClick={() => setShowSidebar(false)}
                    ><i className="flaticon-close"></i></Link>
                </div>
                <Accordion className="accordion-filter" defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            Price Range
                        </Accordion.Header>
                        <Accordion.Body >
                            <div className="range-slider style-1 pb-2">
                                <div id="slider-tooltips">
                                    <SlideDragable filterCriteria={filterCriteria} setFilterCriteria={setFilterCriteria}/>
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item  eventKey="1">
                        <Accordion.Header >
                            Shop by Category
                        </Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services d-flex justify-content-between">
                                <div>
                                    {renderCategoryCheckboxes(categories)}
                                </div>
                            </div>    
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2">
                        <Accordion.Header>Select Author</Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services">
                                {authors.map((author)=>(
                                    <div className="form-check search-content" key={author.id}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`authorCheckBox-${author.id}`}
                                            checked={filterCriteria.authorIds.includes(author.id)}
                                            onChange={() => handleAuthorToggle(author.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`authorCheckBox-${author.id}`}>
                                            {author.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3">
                        <Accordion.Header>Choose Publisher</Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services">
                                {publishers.map((publisher)=>(
                                    <div className="form-check search-content" key={publisher.id}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={`publisherCheckBox-${publisher.id}`}
                                            checked={filterCriteria.publisherIds.includes(publisher.id)}
                                            onChange={() => handlePublisherToggle(publisher.id)}
                                        />
                                        <label className="form-check-label" htmlFor={`publisherCheckBox-${publisher.id}`}>
                                            {publisher.name}
                                        </label>
                                    </div>
                                ))} 
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4">
                        <Accordion.Header>Select Year</Accordion.Header>
                        <Accordion.Body >
                            <div className="widget dz-widget_services col row">
                                {years.map((year, ind) => (
                                    <div className={`col-${ind % 2 === 0 ? '6' : '6'}`}>
                                        <div className="form-check search-content">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`yearCheckBox-${ind}`}
                                                checked={filterCriteria.publishYears.includes(year)}
                                                onChange={() => handleYearToggle(year)}
                                            />
                                            <label className="form-check-label" htmlFor={`yearCheckBox-${ind}`}>
                                                {year}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>                                     
                {/*<Accordion className="accordion-filter accordion-inner" defaultActiveKey="0">*/}
                {/*    {accordionBlog2.map((data, index)=>(*/}
                {/*        <Accordion.Item eventKey={`${index}`}>*/}
                {/*            <Accordion.Header>{data.title}</Accordion.Header>*/}
                {/*            <Accordion.Body>*/}
                {/*                 <ul>*/}
                {/*                    <li><Link to={"#"}>Alone Here</Link></li>*/}
                {/*                    <li><Link to={"#"}>Alien Invassion</Link></li>*/}
                {/*                    <li><Link to={"#"}>Bullo The Cat</Link></li>*/}
                {/*                    <li><Link to={"#"}>Cut That Hair!</Link></li>*/}
                {/*                    <li><Link to={"#"}>Dragon Of The King</Link></li>*/}
                {/*                </ul>              */}
                {/*            </Accordion.Body>*/}
                {/*        </Accordion.Item>*/}
                {/*    ))}*/}
                {/*</Accordion>*/}

                <div className="row filter-buttons">
                    <div>
                        {/*<Link to={"#"} className="btn btn-secondary btnhover mt-4 d-block">Refine Search</Link>*/}
                        <Link
                            className="btn btn-outline-secondary btnhover mt-3 d-block"
                            onClick={() => setFilterCriteria({
                                page: 1,
                                pageSize: 12,
                                minPrice: null,
                                maxPrice: null,
                                categoryIds: [],
                                authorIds: [],
                                publisherIds: [],
                                publishYears: [],
                                sortBy: null,
                                searchQuery: null,
                                status: 1
                            })}
                        >Reset Filter</Link>
                    </div>
                </div>
            </div>
            
        </>
    )
}
export default ShopSidebar;