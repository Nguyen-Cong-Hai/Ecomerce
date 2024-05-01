//React
import { Fragment, useState } from 'react'

//NEXT
import { NextPage } from 'next'

//MUI
import { Collapse, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import List from '@mui/material/List'

//Components
import IconifyIcon from 'src/components/Icon'
import { VerticalItems } from 'src/configs/layout'

type TProps = {}

const RecursiveItems = ({ items, level }: { items: any; level: number }) => {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({})

  const handleClick = (title: string) => {
    setOpenItems(prev => ({
      ...prev,
      [title]: !prev[title]
    }))
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
              <ListItemText primary={item?.title} />
              {item?.childrens && item.childrens.length > 0 && (
                <>
                  {openItems[item.title] ? (
                    <IconifyIcon
                      icon='material-symbols:expand-less'
                      style={{
                        transform: 'rotate(180deg)'
                      }}
                    />
                  ) : (
                    <IconifyIcon icon='material-symbols:expand-less' />
                  )}
                </>
              )}
            </ListItemButton>
            {item?.childrens && item?.childrens?.length > 0 && (
              <>
                <Collapse in={openItems[item.title]} timeout='auto' unmountOnExit>
                  <RecursiveItems items={item?.childrens} level={level + 1} />
                </Collapse>
              </>
            )}
          </Fragment>
        )
      })}
    </>
  )
}

const ListVerticalLayout: NextPage<TProps> = () => {
  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component='nav'
      aria-labelledby='nested-list-subheader'
    >
      <RecursiveItems items={VerticalItems} level={1} />
    </List>
  )
}

export default ListVerticalLayout
