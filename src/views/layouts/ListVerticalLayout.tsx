//React
import { Fragment, useEffect, useState } from 'react'

//NEXT
import { NextPage } from 'next'

//MUI
import { Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import List from '@mui/material/List'

//Components
import IconifyIcon from 'src/components/Icon'
import { VerticalItems } from 'src/configs/layout'

type TProps = {
  open: boolean
}

type TListItem = {
  level: number
  openItems: {
    [key: string]: boolean
  }
  items: any
  setOpenItems: React.Dispatch<
    React.SetStateAction<{
      [key: string]: boolean
    }>
  >
  disabled: boolean
}

const RecursiveItems: NextPage<TListItem> = ({ items, level, openItems, setOpenItems, disabled }) => {
  const handleClick = (title: string) => {
    if (!disabled) {
      setOpenItems(prev => ({
        ...prev,
        [title]: !prev[title]
      }))
    }
  }

  return (
    <>
      {items?.map((item: any) => {
        return (
          <Fragment key={item?.title}>
            <ListItemButton
              sx={{
                padding: `8px 10px 8px ${level * 10}px`
              }}
              onClick={() => {
                if (item?.childrens) {
                  handleClick(item?.title)
                }
              }}
            >
              <ListItemIcon>
                <IconifyIcon icon={item?.icon} />
              </ListItemIcon>
              {!disabled && <ListItemText primary={item?.title} />}
              {item?.childrens && item.childrens.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <IconifyIcon
                      icon='ic:twotone-expand-less'
                      style={{
                        transform: 'rotate(180deg)'
                      }}
                    />
                  ) : (
                    <IconifyIcon icon='ic:twotone-expand-less' />
                  )}
                </>
              )}
            </ListItemButton>
            {item?.childrens && item?.childrens?.length > 0 && (
              <>
                <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                  <RecursiveItems
                    items={item?.childrens}
                    level={level + 1}
                    openItems={openItems}
                    setOpenItems={setOpenItems}
                    disabled={disabled}
                  />
                </Collapse>
              </>
            )}
          </Fragment>
        )
      })}
    </>
  )
}

const ListVerticalLayout: NextPage<TProps> = ({ open }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (!open) {
      handleToggle()
    }
  }, [open])

  const handleToggle = () => {
    setOpenItems({})
  }

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component='nav'>
      <RecursiveItems
        items={VerticalItems}
        level={1}
        disabled={!open}
        setOpenItems={setOpenItems}
        openItems={openItems}
      />
    </List>
  )
}

export default ListVerticalLayout
