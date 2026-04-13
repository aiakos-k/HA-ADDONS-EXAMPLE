/**
 * Main App Component
 */

import { ConfigProvider, Layout, theme } from 'antd'
import { HeaderBar } from '@/components/HeaderBar'
import { Dashboard } from '@/components/Dashboard'
import './App.css'

const { Content, Footer } = Layout

function App() {
  return (
    <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>
      <Layout style={{ minHeight: '100vh' }}>
        <HeaderBar />
        <Content style={{ padding: '24px', background: '#f5f5f5' }}>
          <Dashboard />
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          Home Assistant Add-on &copy; {new Date().getFullYear()}
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default App
