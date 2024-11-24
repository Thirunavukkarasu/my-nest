'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";

export default function AppBreadcrumb() {
    const pathname = usePathname()
    const pathSegments = pathname?.split('/').filter(segment => segment !== '') || []

    return (
        <>
      <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
          
            {pathSegments.map((segment, index) => {
                const href = `/${pathSegments.slice(0, index + 1).join('/')}`
                const isLast = index === pathSegments.length - 1

                return (
                    <>
                        {isLast ? (
                                     <BreadcrumbItem>
                                     <BreadcrumbPage>{segment}</BreadcrumbPage>
                                   </BreadcrumbItem>
                        ) : (
                            <Link href={href} className="text-gray-500 hover:text-gray-700">
                                         <BreadcrumbItem>
                  <BreadcrumbPage>{segment}</BreadcrumbPage>
                </BreadcrumbItem>
                            </Link>
                        )}
                    </>
                )
            })}
                    </BreadcrumbList>
                    </Breadcrumb>    
        </>
    )
}
