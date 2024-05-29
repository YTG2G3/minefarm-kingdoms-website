'use client';

import { marketItems } from '@/lib/schema';
import {
  Button,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  useDisclosure
} from '@nextui-org/react';
import { IconCoin, IconShoppingCart } from '@tabler/icons-react';
import { useContext, useState } from 'react';
import { LiveContext } from './live-provider';

export default function ItemsTable() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data, refresh } = useContext(LiveContext);
  const [item, setItem] = useState<typeof marketItems.$inferSelect>(null);
  const [amount, setAmount] = useState<number>(1);

  function sellItem(id) {
    fetch('/api/sell', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    }).then(() => refresh());
  }

  function purchaseItem(onClose) {
    fetch('/api/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, amount })
    }).then(() => {
      onClose();
      refresh();
    });
  }

  function handlePurchaseClick(item) {
    setItem(item);
    onOpen();
  }

  return (
    <>
      <Table className="px-5">
        <TableHeader>
          <TableColumn>Item</TableColumn>
          <TableColumn>Selling Price</TableColumn>
          <TableColumn>Buying Price</TableColumn>
          <TableColumn align="center">Actions</TableColumn>
        </TableHeader>
        <TableBody>
          {data.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="flex items-center space-x-3">
                <Image
                  src={item.image}
                  width={50}
                  height={50}
                  alt={item.name}
                  isBlurred
                />
                <span className="text-lg font-bold">{item.name}</span>
              </TableCell>
              <TableCell>${item.sellingPrice}</TableCell>
              <TableCell>${item.buyingPrice}</TableCell>
              <TableCell className="space-x-3">
                <Tooltip content="Purchase">
                  <Button
                    isIconOnly
                    color="secondary"
                    onClick={() => handlePurchaseClick(item)}
                  >
                    <IconShoppingCart />
                  </Button>
                </Tooltip>
                <Tooltip content="Sell">
                  <Button
                    isIconOnly
                    onClick={() => sellItem(item.id)}
                    color="success"
                  >
                    <IconCoin />
                  </Button>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Purchase {item.name}</ModalHeader>
              <ModalBody>
                <Input
                  label="Amount"
                  min={1}
                  max={Math.floor(data.money / item.buyingPrice)}
                  value={amount + ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                />
                {amount && amount >= 1 && (
                  <span className="text-sm">
                    Cost: ${amount * item.buyingPrice}
                  </span>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={() => purchaseItem(onClose)}>
                  Purchase
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
