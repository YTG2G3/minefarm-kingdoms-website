'use client';

import { useContext, useState } from 'react';
import { LiveContext } from './live-provider';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Tooltip,
  useDisclosure
} from '@nextui-org/react';
import { teamToColor } from '@/lib/utils';
import moment from 'moment';

export default function Cell({
  r,
  c,
  king,
  team
}: {
  r: number;
  c: number;
  king: boolean;
  team: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data, refresh } = useContext(LiveContext);
  const specificbids = data.bids.filter((b) => b.row === r && b.col === c);
  // const specificbids = [
  //   {
  //     id: '105c9a00-da61-4004-8e53-92719d2e5c5e',
  //     team: 'demacia',
  //     amount: 300,
  //     confirmed: false,
  //     createdAt: moment().add(6, 'm').toDate()
  //   },
  //   {
  //     id: 2,
  //     team: 'ionia',
  //     amount: 200,
  //     confirmed: false,
  //     createdAt: moment().add(2, 'm').toDate()
  //   },
  //   {
  //     id: 1,
  //     team: 'demacia',
  //     amount: 100,
  //     confirmed: false,
  //     createdAt: moment().add(3, 'm').toDate()
  //   }
  // ];
  const occupied = specificbids.length > 0;
  const minamt = occupied ? Math.ceil(specificbids[0].amount * 1.1) : 100;
  const confirmed = occupied && specificbids[0]?.confirmed;
  const [bidAmount, setBidAmount] = useState(minamt);
  const lastBid = occupied && specificbids[0]?.team === team;
  const did5MinutesPass =
    occupied &&
    moment().diff(moment(specificbids[0]?.createdAt)).valueOf() > 300000;

  function placeBid(onClose) {
    fetch('/api/auction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ r, c, amount: bidAmount })
    }).then(() => {
      refresh();
      onClose();
    });
  }

  function declareLand(onClose) {
    fetch('/api/land', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ r: r + 1, c: c + 1 })
    }).then(() => {
      refresh();
      onClose();
    });
  }

  return (
    <>
      <Tooltip
        content={`R${r + 1} C${c + 1}, ${occupied ? (confirmed ? 'Occupied' : 'Auction') : 'Unoccupied'}`}
      >
        <div
          className={`h-10 w-10 ${occupied ? 'border-none' : 'border-4'} rounded-lg ${confirmed ? 'opacity-100' : occupied ? 'opacity-25' : 'opacity-100'} ${confirmed || !king ? 'cursor-default' : 'cursor-pointer'}`}
          style={{
            backgroundColor: occupied
              ? teamToColor(specificbids[0].team)
              : 'transparent'
          }}
          onClick={confirmed || !king ? null : onOpen}
        />
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Land Auction at R{r + 1} C{c + 1}
              </ModalHeader>
              <ModalBody className="space-y-2">
                <ScrollShadow className="max-h-[400px]">
                  {specificbids.map((bid) => (
                    <div
                      key={bid.id}
                      className="flex items-center justify-between border-b p-2"
                    >
                      <div className="flex items-center space-x-3">
                        <span>{bid.team}</span>
                        <span className="text-xs text-zinc-400">
                          {moment
                            .duration(moment(bid.createdAt).diff(moment()))
                            .humanize()}
                        </span>
                      </div>
                      <span>{bid.amount}</span>
                    </div>
                  ))}
                </ScrollShadow>

                {!lastBid ? (
                  <div className="flex items-center space-x-3">
                    <Input
                      type="number"
                      placeholder={`$${minamt}`}
                      min={minamt}
                      max={data.money}
                      label={`Bid Amount (min 10% increase)`}
                      value={bidAmount + ''}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                    />
                  </div>
                ) : !did5MinutesPass ? (
                  <div className="text-sm text-success">
                    You are the last bidder! Please wait 5 minutes before
                    declaring the land yours.
                  </div>
                ) : null}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                {!lastBid ? (
                  <Button color="primary" onPress={() => placeBid(onClose)}>
                    Place Bid
                  </Button>
                ) : did5MinutesPass ? (
                  <Button color="success" onPress={() => declareLand(onClose)}>
                    Declare Land
                  </Button>
                ) : null}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
