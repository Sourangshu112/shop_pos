import { useState,useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import QRCode from 'qrcode';

const ITEM_HEIGHT = 25;   // Height of one row
const BASE_HEIGHT = 250;  // Height of Header + Footer + Margins
const WIDTH = 226;        // 80mm width

// Create styles (CSS-in-JS)
const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
    fontFamily: 'Courier', // Standard PDF font
    width: '80mm', // Thermal paper width
  },
  header: {
    marginBottom: 10,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
    paddingBottom: 5,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Aligns QR with the bottom of the text
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
  },
  infoSection: {
    flexDirection: 'column',
  },
  qrCodeImage: {
    width: 30,
    height: 30,
  },
  shopName: {
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
    paddingVertical: 4,
  },
  colItem: { width: '45%' },
  colQty: { width: '15%' },
  colPrice: { width: '15%', textAlign: 'center' },
  colTotal: { width: '25%', textAlign: 'center' },
  totalSection: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'dashed',
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bold: { fontWeight: 'bold' },
});

// The Document Component
export const ReceiptPDF = ({ items, cart, total, shopDetails, orderId, date }) => {
  const [qrDataUri, setQrDataUri] = useState('');
  const dynamicHeight = Math.max(250, BASE_HEIGHT + (cart.length * ITEM_HEIGHT));
  useEffect(() => {
    // Generate the QR code as a Data URI string
    QRCode.toDataURL(orderId, { margin: 0 }, (err, url) => {
      if (!err) setQrDataUri(url);
    });
  }, [orderId]);

  return (
  <Document>
    {/* Page size for 80mm thermal printer. Height is 'auto' ideally, but we set a safe long height */}
    <Page size={[WIDTH,dynamicHeight]} style={styles.page} wrap={false}> 
      
      {/* 1. HEADER */}
      <View style={styles.header}>
        <Text style={styles.shopName}>{shopDetails.name}</Text>
        <Text>{shopDetails.address}</Text>
        <Text>Tel: {shopDetails.phone}</Text>
        {shopDetails.gst && <Text>GST: {shopDetails.gst}</Text>}
      </View>

      {/* 2. INFO ROW */}
      <View style={styles.infoContainer}>
        <View style={styles.infoSection}>
        <Text style={{ fontSize: 10 }}>Date: {date}</Text>
        <Text style={{ fontSize: 10 }}>Inv: {orderId}</Text>
      </View>
      {qrDataUri && (
        <Image src={qrDataUri} style={styles.qrCodeImage} />
      )}
      </View>

      {/* 3. TABLE HEADER */}
      <View style={[styles.row, { borderBottomWidth: 1 }]}>
        <Text style={[styles.colItem, styles.bold]}>Item</Text>
        <Text style={[styles.colQty, styles.bold]}>Qty</Text>
        <Text style={[styles.colPrice, styles.bold]}>Price</Text>
        <Text style={[styles.colTotal, styles.bold]}>Amt</Text>
      </View>

      {/* 4. ITEMS LOOP */}
      {cart.map((item, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.colItem}>{item.name}</Text>
          <Text style={styles.colQty}>{item.quantity}</Text>
          <Text style={styles.colPrice}>{item.price}</Text>
          <Text style={styles.colTotal}>{(item.price * item.quantity).toFixed(2)}</Text>
        </View>
      ))}

      {/* 5. GRAND TOTAL */}
      <View style={styles.totalSection}>
        <View>
        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Items: {items}</Text>
        </View>
        <View>
        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>TOTAL: </Text>
        <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Rs. {total.toFixed(2)}</Text>
        </View>
      </View>

      {/* 6. FOOTER */}
      <View style={{ marginTop: 20, textAlign: 'center' }}>
        <Text>Thank you for visiting!</Text>
        <Text style={{ fontSize: 8, marginTop: 5 }}>Powered by SyntaxLabPOS</Text>
      </View>

    </Page>
  </Document>
)};