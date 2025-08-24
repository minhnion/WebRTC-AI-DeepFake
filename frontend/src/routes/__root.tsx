import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Layout } from 'antd';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Route = createRootRoute({
  component: () => (
    <Layout className="min-h-screen">
      <Layout.Header className="flex items-center">
        <h1 className="text-xl text-white font-bold">Deepfake Detection Call</h1>
      </Layout.Header>
      <Layout.Content className="p-4 md:p-6">
        <Outlet />
      </Layout.Content>
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </Layout>
  ),
});