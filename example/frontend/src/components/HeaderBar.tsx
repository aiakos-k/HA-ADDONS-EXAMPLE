/**
 * Header Bar Component
 */

import { Layout, Badge } from 'antd'
import { useHAStore } from '@/store/ha'

const { Header } = Layout

export function HeaderBar() {
  const connected = useHAStore((state) => state.connected)

  return (
    <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>
      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, whiteSpace: 'nowrap' }}>
        🏠 Home Assistant Add-on
      </div>
      <Badge
        status={connected ? 'success' : 'error'}
        text={<span style={{ color: '#fff' }}>{connected ? 'Connected' : 'Disconnected'}</span>}
      />
    </Header>
  )
}

export default HeaderBar
