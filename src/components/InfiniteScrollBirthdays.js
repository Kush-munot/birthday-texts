import React, { useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Stack, ButtonGroup, Button } from '@mui/material';
import { data01, data02, data03 } from "../app/utils/sliderData";

const InfiniteScrollBirthdays = ({ initialData }) => {
    const [items, setItems] = useState(data01);
    const [hasMore, setHasMore] = useState(true);


    return (
        <InfiniteScroll
            dataLength={items.length}
            loader={<h4>Loading...</h4>}
            scrollThreshold="200px"
            style={{ overflow: 'hidden' }}
        >
            <Stack sx={{ justifyContent: 'flex-start', flexWrap: 'nowrap', overflowX: 'auto' }}>
                <marquee behavior="scroll" direction="left" scrollamount="3" loop="-1">
                    <Stack direction="row" sx={{ justifyContent: 'right' }}>
                        {
                            data01.map((data, index) => (
                                <ButtonGroup key={index} sx={{ margin: '10px' }}>
                                    <Button sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: '25px', }}>{data.BirthDate}</Button>
                                    <Button sx={{ backgroundColor: '#fff', color: '#1976d2', borderRadius: '25px', }}>{data.Name}</Button>
                                </ButtonGroup>
                            ))
                        }
                    </Stack>
                </marquee>
                <marquee behavior="scroll" direction="left" scrollamount="3">
                    <Stack direction="row" sx={{ justifyContent: 'right' }}>
                        {data02.map((data, index) => (
                            <ButtonGroup key={index} sx={{ margin: '10px' }}>
                                <Button sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: '25px', }}>{data.BirthDate}</Button>
                                <Button sx={{ backgroundColor: '#fff', color: '#1976d2', borderRadius: '25px', }}>{data.Name}</Button>
                            </ButtonGroup>
                        ))}
                    </Stack>
                </marquee>
                <marquee behavior="scroll" direction="left" scrollamount="3">
                    <Stack direction="row" sx={{ justifyContent: 'right' }}>
                        {
                            data03.map((data, index) => (
                                <ButtonGroup key={index} sx={{ margin: '10px' }}>
                                    <Button sx={{ backgroundColor: '#1976d2', color: '#fff', borderRadius: '25px', }}>{data.BirthDate}</Button>
                                    <Button sx={{ backgroundColor: '#fff', color: '#1976d2', borderRadius: '25px', }}>{data.Name}</Button>
                                </ButtonGroup>
                            ))
                        }
                    </Stack>
                </marquee>
            </Stack>
        </InfiniteScroll>
    );
};

export default InfiniteScrollBirthdays;