"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// モック商品データ
const mockProducts = [
  {
    code: "PRD001",
    name: "プレミアムコーヒー豆",
    quantityPerCase: 24,
    totalCases: 50,
    totalQuantity: 1200,
    locations: [
      { column: 'A', position: '1', level: '1', cases: 24 },
      { column: 'B', position: '3', level: '2', cases: 26 }
    ],
    minimumStock: 800,
  },
  {
    code: "PRD002",
    name: "オーガニック紅茶",
    quantityPerCase: 36,
    totalCases: 30,
    totalQuantity: 1080,
    locations: [
      { column: 'A', position: '1', level: '1', cases: 12 },
      { column: 'C', position: '5', level: '3', cases: 18 }
    ],
    minimumStock: 720,
  },
  {
    code: "PRD003",
    name: "抹茶パウダー",
    quantityPerCase: 20,
    totalCases: 25,
    totalQuantity: 500,
    locations: [
      { column: 'A', position: '1', level: '2', cases: 18 },
      { column: 'D', position: '2', level: '1', cases: 7 }
    ],
    minimumStock: 400,
  }
];

export function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredProducts = mockProducts
    .filter(product => 
      product.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      
const aValue = a[sortField as keyof typeof a];
const bValue = b[sortField as keyof typeof b];

      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-[300px]">
          <Input
            placeholder="商品コードまたは商品名で検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> 商品登録
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => handleSort('code')}>
                  商品コード {sortField === 'code' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('name')}>
                  商品名 {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>ケースあたり数量</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('totalCases')}>
                  総ケース数 {sortField === 'totalCases' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('totalQuantity')}>
                  総在庫数 {sortField === 'totalQuantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>保管場所</TableHead>
                <TableHead>状態</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.code}>
                  <TableCell>{product.code}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantityPerCase}</TableCell>
                  <TableCell>{product.totalCases}</TableCell>
                  <TableCell>{product.totalQuantity}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {product.locations.map((loc, index) => (
                        <div key={index} className="text-sm">
                          {loc.column}列 {loc.position}番目 レベル{loc.level}: {loc.cases}ケース
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.totalQuantity < product.minimumStock ? (
                      <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        <span className="text-sm">在庫不足</span>
                      </div>
                    ) : (
                      <span className="text-green-600 text-sm">適正</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      編集
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}