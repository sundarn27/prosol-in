import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'


export default function AddButton({ toggleCard }){


    return(
        <>
            <Button type="primary" onClick={toggleCard} >
              <PlusOutlined />
              Add Item
            </Button>
        </>
    )
}