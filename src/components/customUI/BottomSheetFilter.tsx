/* eslint-disable react-native/no-inline-styles */
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BottomSheet, { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetView } from '@gorhom/bottom-sheet';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type BottomSheetFilterProps = {
    visible: boolean;
    onClose:()=>void;
    onCategorySelect: (category: string) => void;
    onSortAZ: () => void;
};
const BottomSheetFilter = ({visible, onClose, onCategorySelect, onSortAZ}: BottomSheetFilterProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(()=> ['40%', '80%'], []);
    const [section, setSetion] = useState<'main' | 'categories'>('main');
    // The Categories
    const categories = [
        'Fiction', 'Science', 'History', 'Romance', 'Technology',
        'Children', 'Health', 'Education', 'Business', 'Cooking',
    ];

    useEffect(()=>{
        if(visible){
            bottomSheetRef.current?.snapToIndex(1); // open to 40%
        }
        else{
            bottomSheetRef.current?.close();
        }
    },[visible]);

    const handleClose = useCallback(()=>{
        bottomSheetRef.current?.close();
        onClose();
    },[onClose]);

    // Render backdrop component
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.7}
      />
    ),
    []
  );

  const renderMainSection = ()=>{
    return(
        <View style={{flexDirection: 'column', gap:20, padding: 10}}>
            <Text style={styles.sortTxt}>Sort by</Text>
            <View style={{flexDirection: 'column', gap: 10, paddingHorizontal: 20}}>
                <TouchableOpacity style={styles.sortBtn} onPress={onSortAZ}>
                    <Text style={styles.txt}>A - Z</Text>
                    <MaterialIcons name="arrow-forward-ios" color="#A6A6A6" size={15} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> setSetion('categories')} style={styles.sortBtn}>
                    <Text style={styles.txt}>Categories</Text>
                    <MaterialIcons name="arrow-forward-ios" color="#A6A6A6" size={15} />
                </TouchableOpacity>
            </View>
        </View>
    );
  };

  const renderCategories = ()=>{
    return(
        <View style={{flexDirection: 'column', gap:20, padding: 20}}>
            <TouchableOpacity onPress={()=> setSetion('main')}>
               <MaterialIcons name="arrow-back" size={20} color="#000"/>
            </TouchableOpacity>
            <FlatList
                data={categories}
                keyExtractor={(item)=>item}
                renderItem={({item})=>(
                    <View style={{paddingVertical:10, paddingHorizontal:10}}>
                        <TouchableOpacity onPress={()=>{
                            onCategorySelect(item);
                            setSetion('main');
                            bottomSheetRef.current?.close();
                        }} style={styles.sortBtn}>
                            <Text style={styles.txt}>{item}</Text>
                            <MaterialIcons name="arrow-forward-ios" color="#A6A6A6" size={15} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
  };

  return (
    <BottomSheet
        index={-1}
        snapPoints={snapPoints}
        ref={bottomSheetRef}
        enablePanDownToClose={true}
        enableContentPanningGesture={true}
        backgroundStyle={{borderTopLeftRadius: 24, borderTopRightRadius: 24}}
        onClose={handleClose}
        backdropComponent={renderBackdrop}
        handleStyle={styles.handleStyle} // Hide the handle
    >
        <BottomSheetView>
            <View>
                {section === 'main' ? renderMainSection() : renderCategories()}
            </View>
        </BottomSheetView>
    </BottomSheet>
  );
};

export default BottomSheetFilter;

const styles = StyleSheet.create({
    sortTxt:{
        fontSize: 18,
        fontWeight: '600',
        color: '#121212',
        marginLeft: 20,
        marginTop: 10,
    },
    txt:{
        fontSize: 16,
        fontWeight: '500',
        color: '#121212',
    },
    sortBtn:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    handleStyle: {
        paddingTop: 12,
        paddingBottom: 8,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: '#fff',
    },
});