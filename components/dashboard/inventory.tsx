"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDownRight, ArrowUpRight, MoveRight, Search, Plus, ArrowRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// モック商品データ
const mockProducts = [
  { code: "PRD001", name: "プレミアムコーヒー豆" },
  { code: "PRD002", name: "オーガニック紅茶" },
  { code: "PRD003", name: "抹茶パウダー" },
  { code: "PRD004", name: "ルイボスティー" },
];

// 保管場所の構造データ
const COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
const POSITIONS = Array.from({ length: 15 }, (_, i) => i + 1);
const SHELF_LEVELS = [1, 2, 3];

// モック在庫データ
const mockInventory: Record<string, Record<string, Record<string, { code: string; name: string; cases: number; }[]>>> = {
  A: {
    '1': {
      '1': [{ code: 'A1-1-1', name: 'Item A1-1-1', cases: 10 }],
      '2': [{ code: 'A1-2-1', name: 'Item A1-2-1', cases: 5 }],
      '3': [],
    },
  },
};

type InventoryAction = 'outbound' | 'move';

interface LocationInfo {
  column: string;
  position: string;
  level: string;
}

interface InventoryItem {
  code: string;
  name: string;
  cases: number;
}

interface TargetLocation {
  column: string;
  position: string;
  level: string;
}

export function Inventory() {
  const { toast } = useToast();
  const [searchInbound, setSearchInbound] = useState("");
  const [searchOutbound, setSearchOutbound] = useState("");
  const [searchMove, setSearchMove] = useState("");
  const [selectedInbound, setSelectedInbound] = useState("");
  const [selectedOutbound, setSelectedOutbound] = useState("");
  const [selectedMove, setSelectedMove] = useState("");
  const [selectedInboundColumn, setSelectedInboundColumn] = useState("");
  const [selectedInboundPosition, setSelectedInboundPosition] = useState("");
  const [selectedInboundLevel, setSelectedInboundLevel] = useState("");
  const [selectedOutboundColumn, setSelectedOutboundColumn] = useState("");
  const [selectedOutboundPosition, setSelectedOutboundPosition] = useState("");
  const [selectedOutboundLevel, setSelectedOutboundLevel] = useState("");
  const [selectedMoveFromColumn, setSelectedMoveFromColumn] = useState("");
  const [selectedMoveFromPosition, setSelectedMoveFromPosition] = useState("");
  const [selectedMoveFromLevel, setSelectedMoveFromLevel] = useState("");
  const [selectedMoveToColumn, setSelectedMoveToColumn] = useState("");
  const [selectedMoveToPosition, setSelectedMoveToPosition] = useState("");
  const [selectedMoveToLevel, setSelectedMoveToLevel] = useState("");
  const [selectedColumnView, setSelectedColumnView] = useState("");
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<InventoryAction | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [targetLocation, setTargetLocation] = useState<TargetLocation | null>(null);
  const [quantity, setQuantity] = useState<number>(0);

  // 選択された場所の在庫を取得
const getInventoryForLocation = (column: string, position: string, level: string) => {
  return mockInventory[column as keyof typeof mockInventory]?.[position]?.[level] || [];
};


  const handleActionClick = (
    action: InventoryAction,
    product: InventoryItem,
    location: LocationInfo
  ) => {
    setCurrentAction(action);
    setSelectedProduct(product);
    setSelectedLocation(location);
    setQuantity(0);
    setActionDialogOpen(true);
  };

  const handleActionConfirm = () => {
    if (!selectedProduct || !selectedLocation || !quantity) {
      toast({
        title: "エラー",
        description: "必要な情報が不足しています。",
        variant: "destructive",
      });
      return;
    }

    const actionText = currentAction === 'outbound' ? '出庫' : '移動';
    
    // 実際の実装では、ここでデータベースを更新

    toast({
      title: `${actionText}完了`,
      description: `${selectedProduct.name}を${quantity}ケース${actionText}しました。`,
    });

    setActionDialogOpen(false);
    setCurrentAction(null);
    setSelectedProduct(null);
    setSelectedLocation(null);
    setTargetLocation(null);
    setQuantity(0);
  };

  const handleSearchBasedAction = (type: 'inbound' | 'outbound' | 'move') => {
    let actionText = '';
    let location = null;
    let product = null;

    switch (type) {
      case 'inbound':
        if (!selectedInbound || !selectedInboundColumn || !selectedInboundPosition || !selectedInboundLevel) {
          toast({
            title: "エラー",
            description: "必要な情報が不足しています。",
            variant: "destructive",
          });
          return;
        }
        actionText = '入庫';
        product = mockProducts.find(p => p.code === selectedInbound);
        location = {
          column: selectedInboundColumn,
          position: selectedInboundPosition,
          level: selectedInboundLevel
        };
        break;

      case 'outbound':
        if (!selectedOutbound || !selectedOutboundColumn || !selectedOutboundPosition || !selectedOutboundLevel) {
          toast({
            title: "エラー",
            description: "必要な情報が不足しています。",
            variant: "destructive",
          });
          return;
        }
        actionText = '出庫';
        product = mockProducts.find(p => p.code === selectedOutbound);
        location = {
          column: selectedOutboundColumn,
          position: selectedOutboundPosition,
          level: selectedOutboundLevel
        };
        break;

      case 'move':
        if (!selectedMove || !selectedMoveFromColumn || !selectedMoveFromPosition || !selectedMoveFromLevel ||
            !selectedMoveToColumn || !selectedMoveToPosition || !selectedMoveToLevel) {
          toast({
            title: "エラー",
            description: "必要な情報が不足しています。",
            variant: "destructive",
          });
          return;
        }
        actionText = '移動';
        product = mockProducts.find(p => p.code === selectedMove);
        location = {
          column: selectedMoveFromColumn,
          position: selectedMoveFromPosition,
          level: selectedMoveFromLevel
        };
        break;
    }

    if (!product || !location) {
      toast({
        title: "エラー",
        description: "商品または場所の情報が不正です。",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `${actionText}完了`,
      description: `${product.name}を${actionText}しました。`,
    });
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="search" className="space-y-4">
        <TabsList>
          <TabsTrigger value="search">商品検索から操作</TabsTrigger>
          <TabsTrigger value="location">保管場所から操作</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  入庫処理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>商品選択</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input 
                          placeholder="商品コードまたは商品名で検索" 
                          value={searchInbound}
                          onChange={(e) => setSearchInbound(e.target.value)}
                        />
                        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      {searchInbound && (
                        <Select value={selectedInbound} onValueChange={setSelectedInbound}>
                          <SelectTrigger>
                            <SelectValue placeholder="商品を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts
                              .filter(p => 
                                p.code.toLowerCase().includes(searchInbound.toLowerCase()) ||
                                p.name.toLowerCase().includes(searchInbound.toLowerCase())
                              )
                              .map(product => (
                                <SelectItem key={product.code} value={product.code}>
                                  {product.name} ({product.code})
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>保管場所の選択</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={selectedInboundColumn} onValueChange={setSelectedInboundColumn}>
                        <SelectTrigger>
                          <SelectValue placeholder="列" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLUMNS.map(column => (
                            <SelectItem key={column} value={column}>{column}列</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedInboundPosition} onValueChange={setSelectedInboundPosition}>
                        <SelectTrigger>
                          <SelectValue placeholder="番目" />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITIONS.map(position => (
                            <SelectItem key={position} value={position.toString()}>{position}番目</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedInboundLevel} onValueChange={setSelectedInboundLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="レベル" />
                        </SelectTrigger>
                        <SelectContent>
                          {SHELF_LEVELS.map(level => (
                            <SelectItem key={level} value={level.toString()}>レベル {level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="ケース数" />
                    <Button 
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleSearchBasedAction('inbound')}
                    >
                      入庫登録
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  出庫処理
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>商品選択</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input 
                          placeholder="商品コードまたは商品名で検索" 
                          value={searchOutbound}
                          onChange={(e) => setSearchOutbound(e.target.value)}
                        />
                        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      {searchOutbound && (
                        <Select value={selectedOutbound} onValueChange={setSelectedOutbound}>
                          <SelectTrigger>
                            <SelectValue placeholder="商品を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts
                              .filter(p => 
                                p.code.toLowerCase().includes(searchOutbound.toLowerCase()) ||
                                p.name.toLowerCase().includes(searchOutbound.toLowerCase())
                              )
                              .map(product => (
                                <SelectItem key={product.code} value={product.code}>
                                  {product.name} ({product.code})
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>保管場所の選択</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={selectedOutboundColumn} onValueChange={setSelectedOutboundColumn}>
                        <SelectTrigger>
                          <SelectValue placeholder="列" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLUMNS.map(column => (
                            <SelectItem key={column} value={column}>{column}列</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedOutboundPosition} onValueChange={setSelectedOutboundPosition}>
                        <SelectTrigger>
                          <SelectValue placeholder="番目" />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITIONS.map(position => (
                            <SelectItem key={position} value={position.toString()}>{position}番目</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedOutboundLevel} onValueChange={setSelectedOutboundLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="レベル" />
                        </SelectTrigger>
                        <SelectContent>
                          {SHELF_LEVELS.map(level => (
                            <SelectItem key={level} value={level.toString()}>レベル {level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="ケース数" />
                    <Button 
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => handleSearchBasedAction('outbound')}
                    >
                      出庫登録
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle className="text-sm font-medium flex items-center">
                  <MoveRight className="mr-2 h-4 w-4" />
                  在庫移動
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>商品選択</Label>
                    <div className="space-y-2">
                      <div className="relative">
                        <Input 
                          placeholder="商品コードまたは商品名で検索" 
                          value={searchMove}
                          onChange={(e) => setSearchMove(e.target.value)}
                        />
                        <div className="absolute right-0 top-0 h-full flex items-center pr-3">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      {searchMove && (
                        <Select value={selectedMove} onValueChange={setSelectedMove}>
                          <SelectTrigger>
                            <SelectValue placeholder="商品を選択" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockProducts
                              .filter(p => 
                                p.code.toLowerCase().includes(searchMove.toLowerCase()) ||
                                p.name.toLowerCase().includes(searchMove.toLowerCase())
                              )
                              .map(product => (
                                <SelectItem key={product.code} value={product.code}>
                                  {product.name} ({product.code})
                                </SelectItem>
                              ))
                            }
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>移動元の選択</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={selectedMoveFromColumn} onValueChange={setSelectedMoveFromColumn}>
                        <SelectTrigger>
                          <SelectValue placeholder="列" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLUMNS.map(column => (
                            <SelectItem key={column} value={column}>{column}列</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedMoveFromPosition} onValueChange={setSelectedMoveFromPosition}>
                        <SelectTrigger>
                          <SelectValue placeholder="番目" />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITIONS.map(position => (
                            <SelectItem key={position} value={position.toString()}>{position}番目</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedMoveFromLevel} onValueChange={setSelectedMoveFromLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="レベル" />
                        </SelectTrigger>
                        <SelectContent>
                          {SHELF_LEVELS.map(level => (
                            <SelectItem key={level} value={level.toString()}>レベル {level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>移動先の選択</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Select value={selectedMoveToColumn} onValueChange={setSelectedMoveToColumn}>
                        <SelectTrigger>
                          <SelectValue placeholder="列" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLUMNS.map(column => (
                            <SelectItem key={column} value={column}>{column}列</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedMoveToPosition} onValueChange={setSelectedMoveToPosition}>
                        <SelectTrigger>
                          <SelectValue placeholder="番目" />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITIONS.map(position => (
                            <SelectItem key={position} value={position.toString()}>{position}番目</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={selectedMoveToLevel} onValueChange={setSelectedMoveToLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="レベル" />
                        </SelectTrigger>
                        <SelectContent>
                          {SHELF_LEVELS.map(level => (
                            <SelectItem key={level} value={level.toString()}>レベル {level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input type="number" placeholder="ケース数" />
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleSearchBasedAction('move')}
                    >
                      移動実行
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="location" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>保管場所の状況</CardTitle>
              <Select value={selectedColumnView} onValueChange={setSelectedColumnView}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="列を選択" />
                </SelectTrigger>
                <SelectContent>
                  {COLUMNS.map(column => (
                    <SelectItem key={column} value={column}>{column}列</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              {selectedColumnView && (
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {POSITIONS.map((position) => (
                    <Card key={position}>
                      <CardContent className="pt-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">
                              {selectedColumnView}列 {position}番目
                            </h3>
                          </div>
                          
                          {SHELF_LEVELS.map((level) => {
                            const inventory = getInventoryForLocation(selectedColumnView, position.toString(), level.toString());
                            return (
                              <div key={level} className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Label>レベル {level}</Label>
                                  <Button variant="ghost" size="sm">
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                                <ScrollArea className="h-auto max-h-32 rounded-md border p-2">
                                  {inventory.length > 0 ? (
                                    <div className="space-y-2">
                                      {inventory.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between space-x-2">
                                          <div className="flex-1">
                                            <div className="text-sm font-medium">{item.name}</div>
                                            <div className="text-sm text-gray-500">{item.cases}ケース</div>
                                          </div>
                                          <div className="flex space-x-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-100"
                                              onClick={() => handleActionClick('outbound', item, {
                                                column: selectedColumnView,
                                                position: position.toString(),
                                                level: level.toString()
                                              })}
                                            >
                                              <ArrowDownRight className="h-4 w-4" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-100"
                                              onClick={() => handleActionClick('move', item, {
                                                column: selectedColumnView,
                                                position: position.toString(),
                                                level: level.toString()
                                              })}
                                            >
                                              <MoveRight className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-sm text-gray-400 text-center py-2">
                                      商品なし
                                    </div>
                                  )}
                                </ScrollArea>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>最近の取引履歴</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>日時</TableHead>
                <TableHead>商品名</TableHead>
                <TableHead>種別</TableHead>
                <TableHead>数量</TableHead>
                <TableHead>保管場所</TableHead>
                <TableHead>担当者</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-03-20 14:30</TableCell>
                <TableCell>プレミアムコーヒー豆</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    入庫
                  </span>
                </TableCell>
                <TableCell>+24</TableCell>
                <TableCell>A列 1番目 レベル1</TableCell>
                <TableCell>山田太郎</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-03-20 15:45</TableCell>
                <TableCell>オーガニック紅茶</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    移動
                  </span>
                </TableCell>
                <TableCell>12</TableCell>
                <TableCell>A列 1番目 レベル1 → C列 15番目 レベル3</TableCell>
                <TableCell>山田太郎</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentAction === 'outbound' ? '出庫処理' : '在庫移動'}
            </DialogTitle>
            <DialogDescription>
              以下の内容で{currentAction === 'outbound' ? '出庫' : '移動'}を実行します。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>商品情報</Label>
              <div className="p-3 bg-gray-50 rounded-md">
                <div className="font-medium">{selectedProduct?.name}</div>
                <div className="text-sm text-gray-500">
                  現在の在庫: {selectedProduct?.cases}ケース
                </div>
                <div className="text-sm text-gray-500">
                  場所: {selectedLocation?.column}列 {selectedLocation?.position}番目 レベル{selectedLocation?.level}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>処理数量</Label>
              <Input
                type="number"
                min="1"
                max={selectedProduct?.cases}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                placeholder="ケース数を入力"
              />
            </div>

            {currentAction === 'move' && (
              <div className="space-y-2">
                <Label>移動先</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={targetLocation?.column}
                    onValueChange={(value) => setTargetLocation(prev => ({ ...prev || {}, column: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="列" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLUMNS.map(column => (
                        <SelectItem key={column} value={column}>{column}列</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={targetLocation?.position}
                    onValueChange={(value) => setTargetLocation(prev => ({ ...prev || {}, position: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="番目" />
                    </SelectTrigger>
                    <SelectContent>
                      {POSITIONS.map(position => (
                        <SelectItem key={position} value={position.toString()}>{position}番目</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={targetLocation?.level}
                    onValueChange={(value) => setTargetLocation(prev => ({ ...prev || { }, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="レベル" />
                    </SelectTrigger>
                    <SelectContent>
                      {SHELF_LEVELS.map(level => (
                        <SelectItem key={level} value={level.toString()}>レベル{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setActionDialogOpen(false);
                setCurrentAction(null);
                setSelectedProduct(null);
                setSelectedLocation(null);
                setTargetLocation(null);
                setQuantity(0);
              }}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleActionConfirm}
              className={currentAction === 'outbound' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}
            >
              {currentAction === 'outbound' ? '出庫' : '移動'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
