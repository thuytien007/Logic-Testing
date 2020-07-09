using System;

namespace Test
{
    class minMaxSum
    {
        //interchange sort
        static void increasingSort(long[] arr)
        {
            //for (int i = 0; i < arr.Length - 1; i++)
            //{
            //    for (int j = i + 1; j < arr.Length; j++)
            //    {
            //        if (arr[i] > arr[j])
            //        {
            //            //swap
            //            long temp = arr[i];
            //            arr[i] = arr[j];
            //            arr[j] = temp;
            //        }
            //    }
            //}
            //flag value
            //bool valuesSwitched = false;
            //for (int i = 1; i <= arr.Length; i++)
            //{
                //if (i == arr.Length)
                //{
                    //if (!valuesSwitched) break;

                    //valuesSwitched = false;
                    //i = 1;
                //}
                //if (arr[i - 1] > arr[i])
                //{
                    //long temp = arr[i - 1];
                    //arr[i - 1] = arr[i];
                    //arr[i] = temp;
                    //valuesSwitched = true;
                //}
            //}
        //}
        static void miniMaxSum(long[] arr)
        {
            //long min = 0;
            //long max = 0;
            //increasingSort(arr);
            //solution 1 with 4 loops
            //for (int i = 0; i < 4; i++)
            //{
            //    min += arr[i];
            //}
            //for (int j = arr.Length-1; j > arr.Length-5; j--)
            //{
            //    max += arr[j];
            //}
            //solution 2 with 2 loops
            /*long i = 0;
            long lenght = arr.Length;
            while(i <= lenght+1)
            {
                if (i < 4)
                {
                    min += arr[i];
                    i++;
                }   
                if(lenght > arr.Length - 5)
                {
                    max += arr[lenght-1];
                    lenght--;
                }
            }*/
            //cach 3 voi 1 vong lap for
            long min = arr[0];
            long max = arr[0];
            long sum = arr[0];
            long v = 0;
    
            for (long i = 1; i < arr.Length; i++)
            {
                v = arr[i];
                sum += v;
                if (v > max) max = v;
                if (v < min) min = v;
            }
            Console.WriteLine(sum - max);
            Console.WriteLine(sum - min);
        }
        static void Main(string[] args)
        {
            long[] arr = Array.ConvertAll(Console.ReadLine().Split(' '), arrTemp => Convert.ToInt64(arrTemp));
            miniMaxSum(arr);
            Console.ReadLine();
        }
    }
}
